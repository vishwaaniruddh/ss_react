/**
 * Category ID mappings (Jewellery + Bridal Wear)
 * ───────────────────────────────────────────────────────────────────────────
 * Mirrors the legacy PHP backend:
 *   - `jewel_main`  → top-level jewellery category (e.g. Earrings, Necklace Sets)
 *   - `jewel_sub`   → sub-category under a main jewellery category
 *   - `garment`     → bridal-wear category (single level — no sub-categories)
 *
 * The backend exposes products through a single endpoint that accepts a
 * `category` parameter shaped like `<type>:<id>`. Use `buildCategoryQuery()`
 * below to construct that string from a category node.
 *
 * Each node carries:
 *   - label       human-readable name (matches legacy menu text exactly)
 *   - slug        URL-safe segment used in our SPA routes
 *   - type        'jewel_main' | 'jewel_sub' | 'garment'
 *   - id          backend numeric ID
 *   - children    optional array of `jewel_sub` nodes (jewellery only)
 *
 * Keep this file in sync with the legacy mega-menu — it is the single source
 * of truth for product-listing pages, breadcrumbs, and SEO metadata.
 */

export const JEWELLERY_CATEGORIES = [
  { label: 'Baju Bandh',          slug: 'baju-bandh',          type: 'jewel_main', id: 25 },
  { label: 'Bangles',             slug: 'bangles',             type: 'jewel_main', id: 21 },
  { label: 'Borlas',              slug: 'borlas',              type: 'jewel_main', id: 11 },
  { label: 'Bracelet',            slug: 'bracelet',            type: 'jewel_main', id: 22 },
  { label: 'Bridal Jewellery',    slug: 'bridal-jewellery',    type: 'jewel_main', id: 29 },
  { label: 'Damini / Mathapatti', slug: 'damini-mathapatti',   type: 'jewel_main', id: 14 },
  
  {
    label: 'Earrings',
    slug: 'earrings',
    type: 'jewel_main',
    id: 17,
    children: [
      { label: 'Antique',   slug: 'antique',   type: 'jewel_sub', id: 77 },
      { label: 'Bugadi',    slug: 'bugadi',    type: 'jewel_sub', id: 80 },
      { label: 'Diamond',   slug: 'diamond',   type: 'jewel_sub', id: 74 },
      { label: 'Imitation', slug: 'imitation', type: 'jewel_sub', id: 78 },
      { label: 'Kundan',    slug: 'kundan',    type: 'jewel_sub', id: 75 },
      { label: 'Oxidized',  slug: 'oxidized',  type: 'jewel_sub', id: 79 },
      { label: 'Vilandi',   slug: 'vilandi',   type: 'jewel_sub', id: 76 },
    ],
  },
  { label: 'Hair Accessories', slug: 'hair-accessories', type: 'jewel_main', id: 27 },
  
  { label: 'Hath Phool', slug: 'hath-phool', type: 'jewel_main', id: 69 },
  { label: 'Tikka', slug: 'tikka', type: 'jewel_main', id: 63 },

  { label: 'Kamar Patta', slug: 'kamar-patta', type: 'jewel_main', id: 15 },
  { label: 'Mala',        slug: 'mala',        type: 'jewel_main', id: 26 },
  {
    label: 'Necklace Sets',
    slug: 'necklace-sets',
    type: 'jewel_main',
    id: 1,
    children: [
      { label: 'American Diamond',  slug: 'american-diamond',  type: 'jewel_sub', id: 2 },
      { label: 'Antique',           slug: 'antique',           type: 'jewel_sub', id: 1 },
      { label: 'Imitation',         slug: 'imitation',         type: 'jewel_sub', id: 6 },
      { label: 'Kundan',            slug: 'kundan',            type: 'jewel_sub', id: 3 },
      { label: 'South Indian Set',  slug: 'south-indian-set',  type: 'jewel_sub', id: 68 },
      { label: 'Vilandi / Polki',   slug: 'vilandi-polki',     type: 'jewel_sub', id: 4 },
    ],
  },
  { label: 'Payal / Pag Pan', slug: 'payal-pag-pan', type: 'jewel_main', id: 65 },
  { label: 'Pendant Set', slug: 'pendant-set', type: 'jewel_main', id: 24 },
  
]

/**
 * Bridal wear (garments) — flat list, no sub-categories at the legacy level.
 */
export const BRIDAL_CATEGORIES = [
  { label: 'Evening Gowns',                slug: 'evening-gowns',         type: 'garment', id: 22 },
  { label: 'Indo Western Outfits',         slug: 'indo-western-outfits',  type: 'garment', id: 28 },
  { label: 'Lehenga Choli',                slug: 'lehenga-choli',         type: 'garment', id: 10 },
  { label: 'Trail Gowns / Infinity Gowns', slug: 'trail-gowns',           type: 'garment', id: 29 },
]

/* ────────────────────────────────────────────────────────────────────────────
 * Lookup helpers
 *
 * Three flat indexes are built once at module load — O(1) reads from any
 * component without traversing the trees on every render.
 *
 * Indexes are scoped per "section" (jewellery vs bridal) to prevent cross-
 * section slug collisions (e.g. `evening-gowns` only lives under bridal).
 * ──────────────────────────────────────────────────────────────────────────── */

const _jewelleryBySlugPath = new Map()  // 'earrings' / 'earrings/antique'
const _bridalBySlugPath    = new Map()  // 'evening-gowns'
const _byTypeId            = new Map()  // 'jewel_main:17' / 'jewel_sub:77' / 'garment:22'

;(function buildIndexes() {
  // Jewellery (with optional jewel_sub children)
  for (const main of JEWELLERY_CATEGORIES) {
    _jewelleryBySlugPath.set(main.slug, main)
    _byTypeId.set(`${main.type}:${main.id}`, main)
    if (main.children) {
      for (const sub of main.children) {
        _jewelleryBySlugPath.set(`${main.slug}/${sub.slug}`, { ...sub, parent: main })
        // Sub IDs can collide across mains (e.g. necklace-sets:1 and earrings
        // both reuse small integers). The `type:id` key disambiguates by type.
        _byTypeId.set(`${sub.type}:${sub.id}`, { ...sub, parent: main })
      }
    }
  }

  // Bridal — flat list of garments
  for (const node of BRIDAL_CATEGORIES) {
    _bridalBySlugPath.set(node.slug, node)
    _byTypeId.set(`${node.type}:${node.id}`, node)
  }
})()

/**
 * Resolve a jewellery category by its SPA slug path.
 *
 * @example
 *   findCategoryBySlugPath('earrings')          // → Earrings main node
 *   findCategoryBySlugPath('earrings/kundan')   // → Kundan sub node (with .parent)
 */
export function findCategoryBySlugPath(slugPath) {
  if (!slugPath) return null
  return _jewelleryBySlugPath.get(slugPath) || null
}

/**
 * Resolve a bridal (garment) category by slug.
 *
 * @example
 *   findBridalCategoryBySlug('evening-gowns')   // → Evening Gowns node
 */
export function findBridalCategoryBySlug(slug) {
  if (!slug) return null
  return _bridalBySlugPath.get(slug) || null
}

/**
 * Resolve a category by `type:id` — handy when the API returns a raw type
 * string (e.g. coming back from a saved filter).
 */
export function findCategoryByTypeId(type, id) {
  return _byTypeId.get(`${type}:${id}`) || null
}

/**
 * Build the query string the legacy backend expects for product fetches.
 * Pass either a category node from this module or `{ type, id }` directly.
 *
 * @example
 *   buildCategoryQuery({ type: 'jewel_main', id: 17 })  // → 'jewel_main:17'
 *   buildCategoryQuery({ type: 'garment', id: 22 })     // → 'garment:22'
 */
export function buildCategoryQuery(node) {
  if (!node?.type || node?.id == null) return null
  return `${node.type}:${node.id}`
}

/**
 * Convenience: get the SPA route path for a given category node.
 *
 * - jewel_main / jewel_sub → /jewellery/...
 * - garment                → /bridal/<slug>
 */
export function categoryRoute(node) {
  if (!node) return '/'
  if (node.type === 'garment') {
    return `/bridal/${node.slug}`
  }
  if (node.type === 'jewel_sub' && node.parent) {
    return `/jewellery/${node.parent.slug}/${node.slug}`
  }
  return `/jewellery/${node.slug}`
}
