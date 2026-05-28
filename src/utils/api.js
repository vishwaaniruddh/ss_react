/**
 * API client for the Sri Shringaar legacy backend
 * ───────────────────────────────────────────────────────────────────────────
 * The backend is a PHP endpoint that returns JSON. We keep the surface tiny
 * and predictable: every request goes through `apiFetch`, every product comes
 * out of `normalizeApiProduct` so downstream components see a single shape.
 *
 * Configure the base URL via `VITE_API_BASE_URL` in `.env`. The default is
 * the relative path `/api/v1`, which the Vite dev server proxies to the
 * production host (see vite.config.js). This sidesteps CORS in development
 * without changing any backend code. In production, set VITE_API_BASE_URL
 * to the absolute API origin or rely on same-origin hosting.
 */

const DEFAULT_API_BASE_URL = '/API/v1'

export const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '')

/**
 * Build a URL with query params. `null` / `undefined` / `''` values are
 * dropped so we don't send `min_price=&max_price=` style noise.
 *
 * Supports both absolute base URLs (e.g. `https://api.example.com/v1`) and
 * relative ones (e.g. `/api/v1`) — relative bases let the Vite dev proxy
 * intercept the request and forward it to the upstream host without CORS.
 */
function buildUrl(path, params = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const isAbsolute = /^https?:\/\//i.test(API_BASE_URL)

  // Use URLSearchParams for query construction; `URL` chokes on relative bases.
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  const suffix = qs ? `?${qs}` : ''

  if (isAbsolute) {
    const url = new URL(`${API_BASE_URL}${cleanPath}`)
    for (const [key, value] of search) url.searchParams.set(key, value)
    return url.toString()
  }
  return `${API_BASE_URL}${cleanPath}${suffix}`
}

/**
 * Thin fetch wrapper.
 *
 * - Throws an `Error` (with `.status` on it) for non-2xx responses.
 * - Surfaces backend `status: "error"` payloads as thrown errors.
 * - Forwards an `AbortSignal` so callers can cancel in-flight requests when
 *   filters change.
 */
export async function apiFetch(path, { params, signal, init } = {}) {
  const url = buildUrl(path, params)
  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      signal,
      ...init,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    const error = new Error(`Network request failed: ${err?.message || err}`)
    error.cause = err
    throw error
  }

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  let body
  try {
    body = await response.json()
  } catch (err) {
    const error = new Error('Response was not valid JSON')
    error.cause = err
    throw error
  }

  if (body?.status && body.status !== 'success') {
    const error = new Error(body?.message || `API returned status: ${body.status}`)
    error.payload = body
    throw error
  }

  return body
}

/* ────────────────────────────────────────────────────────────────────────────
 * Normalizer
 *
 * Backend product shape (from /products.php):
 *   {
 *     id: "4831", name, code, type, original_sales_price,
 *     details: { sale_price, rent_price, deposit, image_path, mrp, inventory }
 *   }
 *
 * We flatten + coerce types and add a few derived fields so this object can
 * be dropped straight into <ProductCard /> without conditional plumbing.
 * ──────────────────────────────────────────────────────────────────────────── */

const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function normalizeApiProduct(raw) {
  if (!raw) return null
  const details = raw.details || {}

  const id = toNumber(raw.id) ?? raw.id
  const salePrice = toNumber(details.sale_price)
  const mrp = toNumber(details.mrp)
  const rentPrice = toNumber(details.rent_price)
  const deposit = toNumber(details.deposit)
  const inventory = toNumber(details.inventory) ?? 0

  // The backend always returns an `image_path`. When the product has no
  // photo on file, it falls back to a hard-coded "default.jpg" URL — that
  // shouldn't count as a real image for filtering purposes.
  const heroImageRaw = details.image_path || null
  const isFallbackImage = (img) => {
    if (!img) return true
    const s = String(img).toLowerCase().trim()
    if (!s || s === 'null' || s === 'undefined') return true
    // Strip query string + fragment for matching.
    const path = s.split('?')[0].split('#')[0]
    // Server-side default placeholder (any ext) and well-known empty markers.
    if (/\/(?:static\/images|images)?\/?default\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(path)) return true
    if (/\bdefault\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(path)) return true
    if (/\bplaceholder[-_]?product\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(path)) return true
    if (/\bno[-_]?image\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(path)) return true
    if (/main_logo\.(?:png|jpg|svg)$/i.test(path)) return true
    return false
  }
  const heroImage = isFallbackImage(heroImageRaw) ? null : heroImageRaw

  // /products.php returns a single `details.image_path`.
  // /product-detail.php returns a full `images[]` array on the root.
  // Merge both, keeping the hero first and de-duplicating; drop any URL
  // that is the server's default placeholder.
  const galleryRaw = Array.isArray(raw.images)
    ? raw.images.filter((img) => img && !isFallbackImage(img))
    : []
  const merged = []
  if (heroImage) merged.push(heroImage)
  for (const img of galleryRaw) {
    if (!merged.includes(img)) merged.push(img)
  }

  return {
    id,
    name: raw.name || 'Untitled',
    code: raw.code || null,
    type: raw.type || null,
    catId: toNumber(raw.cat_id) ?? raw.cat_id ?? null,

    // Display pricing (drives ProductCard / listing pages)
    price: salePrice ?? mrp ?? 0,
    originalPrice: mrp && salePrice && mrp > salePrice ? mrp : null,

    // Rental model fields preserved for ProductDetails
    salePrice,
    mrp,
    rentPrice,
    deposit,

    // Cards expect an array; listing has 1 image, detail has many.
    images: merged,
    hasRealImage: merged.length > 0,
    inventory,
    inStock: inventory > 0,

    // /product-detail.php returns a `product_desc` rich-text blurb. The
    // listing endpoint doesn't include it, so this stays undefined for
    // ProductCard previews and is only populated on the detail page.
    description: raw.product_desc || undefined,
    category: undefined,
    collection: undefined,
    rating: undefined,
    reviewCount: undefined,
    isNew: false,
    tags: [],
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Endpoints
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Fetch a single product (with full image gallery) by id + type.
 *
 * Calls /product-detail.php which, unlike the listing endpoint, returns an
 * `images[]` array instead of a single hero image. The `type` parameter is
 * required by the backend (jewellery | garments) — use `getProductById`
 * below if you only have the id.
 *
 * @param {object}  options
 * @param {number|string} options.id
 * @param {string}        options.type    'jewellery' | 'garments'
 * @param {AbortSignal=}  options.signal
 *
 * @returns {Promise<object|null>}  normalized product, or null when missing.
 */
export async function getProductDetail({ id, type, signal } = {}) {
  if (id == null || !type) return null
  const body = await apiFetch('/product-detail.php', {
    params: { id, type },
    signal,
  })
  if (!body?.data) return null
  return normalizeApiProduct(body.data)
}

/**
 * Fetch a single product by id.
 *
 * The legacy `/products.php` endpoint does not expose a true "by-id" lookup,
 * and `/product-detail.php` requires a `type` we don't carry in the slug.
 * Two-step strategy:
 *   1. Search by the SEO-slug name on /products.php and find the row whose
 *      id matches — that gives us the canonical `type` (jewellery|garments).
 *   2. Call /product-detail.php with the resolved id+type to pull the full
 *      image gallery and detail fields.
 *
 * If step 1 fails (slug missing/garbled), step 2 falls back to trying both
 * known types in parallel — whichever responds successfully wins.
 *
 * @param {object}   options
 * @param {number|string} options.id        numeric product id from the URL
 * @param {string=}  options.name           product name (used as the search query)
 * @param {AbortSignal=} options.signal
 *
 * @returns {Promise<object|null>}  normalized product with full gallery.
 */
export async function getProductById({ id, name, signal } = {}) {
  if (id == null) return null
  const targetId = String(id)

  // Step 1: discover the product type via search.
  let resolvedType = null
  if (name) {
    try {
      const body = await apiFetch('/products.php', {
        params: { search: name, page: 1 },
        signal,
      })
      const items = Array.isArray(body?.data) ? body.data : []
      const hit = items.find((p) => String(p.id) === targetId)
      if (hit?.type) resolvedType = hit.type
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      // Non-fatal — fall through to the parallel-type probe.
    }
  }

  // Step 2a: with a known type, hit the detail endpoint directly.
  if (resolvedType) {
    return getProductDetail({ id: targetId, type: resolvedType, signal })
  }

  // Step 2b: type unknown — probe both known types in parallel.
  const probes = ['jewellery', 'garments'].map(async (type) => {
    try {
      return await getProductDetail({ id: targetId, type, signal })
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      return null
    }
  })
  const results = await Promise.all(probes)
  return results.find(Boolean) || null
}

/**
 * Search products by name / code.
 *
 * Hits /products.php with a `search` query and an optional `limit` so we
 * can keep the results panel snappy (8 is the legacy default for the search
 * overlay). Reuses the same normalization as the listing endpoint.
 *
 * @param {object}   options
 * @param {string}   options.query
 * @param {number=}  options.limit       default 8
 * @param {number=}  options.page        default 1
 * @param {AbortSignal=} options.signal
 *
 * @returns {Promise<{ items: object[], pagination: object }>}
 */
export async function searchProducts({ query, limit = 8, page = 1, signal } = {}) {
  if (!query || !query.trim()) {
    return { items: [], pagination: { total: 0, page, limit, total_pages: 0 } }
  }

  const body = await apiFetch('/products.php', {
    params: { search: query.trim(), limit, page },
    signal,
  })

  const items = Array.isArray(body?.data) ? body.data.map(normalizeApiProduct).filter(Boolean) : []
  const pagination = body?.pagination || { total: items.length, page, limit, total_pages: 1 }

  return { items, pagination }
}

/**
 * Sort options accepted by /products.php — keep this list aligned with the
 * backend so we can validate before sending.
 */
export const PRODUCT_SORT_OPTIONS = [
  { value: 'sku_desc',   label: 'Newest First' },
  { value: 'sku_asc',    label: 'Oldest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc',   label: 'Name: A to Z' },
  { value: 'name_desc',  label: 'Name: Z to A' },
]

/**
 * Fetch a paginated list of products.
 *
 * @param {object}  options
 * @param {string=} options.category   `jewel_main:25` etc. (use `buildCategoryQuery`)
 * @param {string=} options.type       'jewellery' | 'garments' — restricts the listing to one section
 * @param {string=} options.search     free-text query (matches name/code on the backend)
 * @param {number=} options.page       1-based page number (default 1)
 * @param {number=} options.minPrice
 * @param {number=} options.maxPrice
 * @param {string=} options.sort       one of PRODUCT_SORT_OPTIONS (default 'sku_desc')
 * @param {AbortSignal=} options.signal
 *
 * @returns {Promise<{ items: object[], pagination: object }>}
 */
export async function getProducts({
  category,
  type,
  search,
  page = 1,
  minPrice,
  maxPrice,
  sort = 'sku_desc',
  signal,
} = {}) {
  const body = await apiFetch('/products.php', {
    params: {
      category,
      type,
      search,
      page,
      min_price: minPrice,
      max_price: maxPrice,
      sort,
    },
    signal,
  })

  const items = Array.isArray(body?.data) ? body.data.map(normalizeApiProduct).filter(Boolean) : []
  const pagination = body?.pagination || { total: items.length, page, limit: items.length, total_pages: 1 }

  return { items, pagination, raw: body }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Google Reviews
 *
 * Hits the cached server proxy at /v1/google-reviews.php — never the Google
 * API directly. The PHP layer hides the API key, persists a 24-hour cache,
 * and degrades gracefully to stale data if a fetch fails.
 * ──────────────────────────────────────────────────────────────────────────── */
export async function getGoogleReviews({ signal } = {}) {
  const body = await apiFetch('/google-reviews.php', { signal })
  return body?.data || null
}

/* ────────────────────────────────────────────────────────────────────────────
 * Instagram Feed
 *
 * Scraped via /v1/instagram-feed.php. Returns the most recent post
 * shortcodes for the configured profile, cached for 6 hours.
 * ──────────────────────────────────────────────────────────────────────────── */
export async function getInstagramFeed({ signal } = {}) {
  const body = await apiFetch('/instagram-feed.php', { signal })
  return body?.data || null
}
