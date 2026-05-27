import { useEffect, useState } from 'react'

/**
 * Default placeholder served from `/public/placeholder-product.svg`.
 * Centralised here so swapping the asset later is a single-line change.
 */
export const PRODUCT_PLACEHOLDER = '/placeholder-product.svg'

/**
 * Resolve a usable image URL for a product, with placeholder fallback.
 *
 * Used outside React (e.g. SEO meta) where the runtime onError dance
 * isn't an option. Strings that look empty / "null" / "undefined" are
 * treated as missing.
 */
export function resolveProductImage(src) {
  if (!src) return PRODUCT_PLACEHOLDER
  const cleaned = String(src).trim()
  if (!cleaned || cleaned === 'null' || cleaned === 'undefined') return PRODUCT_PLACEHOLDER
  return cleaned
}

/**
 * <ProductImage /> — drop-in replacement for `<img>` for product photos.
 *
 * Behaviour:
 *   - Empty / null `src` → placeholder.
 *   - Real URL that 404s or fails to load → placeholder (one swap, no
 *     infinite loops thanks to a `triedFallback` ref).
 *   - All standard `<img>` props pass through (className, style, loading,
 *     width, height, etc.).
 *
 * NOTE: framer-motion's `<motion.img />` doesn't expose `onError` as a
 * variant, so call sites that need both motion AND fallback should wrap
 * <ProductImage /> in a <motion.div /> for animation and pass through
 * className/style as needed.
 */
export default function ProductImage({
  src,
  alt = '',
  fallback = PRODUCT_PLACEHOLDER,
  ...rest
}) {
  const initial = resolveProductImage(src) === PRODUCT_PLACEHOLDER ? fallback : src
  const [currentSrc, setCurrentSrc] = useState(initial)
  const [didFallback, setDidFallback] = useState(initial === fallback)

  // Reset state when the underlying src prop changes (e.g. user clicks
  // through to a different gallery thumbnail). Without this, switching
  // back to a working image after one had errored would stay on the
  // placeholder forever.
  useEffect(() => {
    const next = resolveProductImage(src)
    if (next === PRODUCT_PLACEHOLDER) {
      setCurrentSrc(fallback)
      setDidFallback(true)
    } else {
      setCurrentSrc(next)
      setDidFallback(false)
    }
  }, [src, fallback])

  const handleError = () => {
    if (didFallback) return // already on the placeholder, avoid loops
    setCurrentSrc(fallback)
    setDidFallback(true)
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  )
}
