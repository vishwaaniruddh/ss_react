/**
 * Format price in Indian Rupees
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 120) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

/**
 * Generate a slug from text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Build a SEO-friendly product URL: /product/<slug>-<id>
 */
export function productUrl(product) {
  return `/product/${slugify(product.name)}-${product.id}`
}

/**
 * Extract the numeric product ID from a "<slug>-<id>" path segment.
 * Returns null when no trailing ID is present.
 */
export function parseProductSlug(slugWithId) {
  if (!slugWithId) return null
  const match = String(slugWithId).match(/-(\d+)$/)
  if (!match) {
    // Fallback: bare numeric IDs (legacy URLs like /product/4)
    return /^\d+$/.test(slugWithId) ? Number(slugWithId) : null
  }
  return Number(match[1])
}

/**
 * Extract the human-readable name portion of a "<slug>-<id>" segment.
 * Used as a search hint when fetching a single product by id from the
 * legacy backend (which has no native by-id endpoint).
 *
 * @example
 *   parseProductSlugName('rose-pink-draped-and-embroidered-gown-2382')
 *   // → 'rose pink draped and embroidered gown'
 */
export function parseProductSlugName(slugWithId) {
  if (!slugWithId) return ''
  const withoutId = String(slugWithId).replace(/-(\d+)$/, '')
  return withoutId.replace(/-/g, ' ').trim()
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor
}

/**
 * Calculate a daily rental rate from product MRP.
 * Rule of thumb for couture/jewellery rentals: ~5% of MRP per day, min ₹999.
 */
export function dailyRentalRate(mrp) {
  const computed = Math.round(mrp * 0.05)
  return Math.max(999, computed)
}

/**
 * Rental cost based on the API-provided `rent_price`, which represents the
 * total charge for a 3-day rental (the legacy default). For longer rentals
 * we add 5% of the base price per extra day, mirroring the original PHP
 * storefront logic so prices stay consistent with the legacy site.
 *
 *   3 days  → basePrice
 *   4 days  → basePrice × 1.05
 *   5 days  → basePrice × 1.10
 *   6 days  → basePrice × 1.15
 *   7 days  → basePrice × 1.20
 *
 * Days outside the 3–7 range are clamped to the nearest endpoint.
 */
export function rentalChargeFromBase(basePrice, days) {
  if (!basePrice || basePrice <= 0) return 0
  const safeDays = Math.max(3, Math.min(7, Number(days) || 3))
  const extraDays = Math.max(0, safeDays - 3)
  const charge = basePrice + (extraDays * basePrice * 0.05)
  return Math.round(charge)
}

/**
 * Total rental cost given MRP and duration in days.
 * Includes a small multi-day discount: -2% for 5+ days, -5% for 7+ days.
 */
export function rentalTotal(mrp, days) {
  const daily = dailyRentalRate(mrp)
  const subtotal = daily * days
  let discount = 0
  if (days >= 7) discount = 0.05
  else if (days >= 5) discount = 0.02
  return Math.round(subtotal * (1 - discount))
}

/**
 * Refundable security deposit (typically 20% of MRP, capped).
 */
export function securityDeposit(mrp) {
  return Math.min(Math.round(mrp * 0.2), 50000)
}

/**
 * Format a Date to YYYY-MM-DD (HTML <input type="date"> value format).
 */
export function toDateInputValue(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Format a Date for display: "Mon, 26 May 2026"
 */
export function formatDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Add `n` days to a date and return a new Date.
 */
export function addDays(date, n) {
  const d = date instanceof Date ? new Date(date) : new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/**
 * Number of nights between two dates (inclusive of start, exclusive of end+1).
 * For rentals we count "rental days" as `daysBetween + 1` so a same-day pickup
 * and return counts as 1 day.
 */
export function rentalDays(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  s.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24))
  return diff + 1
}
