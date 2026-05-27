import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '@/store/useStore'
import { formatPrice, productUrl } from '@/utils/helpers'
import { cardHover, imageZoom } from '@/animations/variants'
import ProductImage, { PRODUCT_PLACEHOLDER } from '@/components/ui/ProductImage'

/**
 * ProductCard
 * ───────────────────────────────────────────────────────────────────────────
 * Grid card for product listings. Behavioural notes:
 *
 *  - The whole card is a single `<Link>` to the product detail page so
 *    image OR title clicks both navigate. We deliberately do NOT expose an
 *    "Add to Bag" action here — rentals require a date range that only
 *    exists on the detail page, so reservations always go through there.
 *
 *  - The wishlist button is the only foreground action. It uses
 *    `event.preventDefault()` to stop the surrounding link's navigation
 *    when toggled.
 *
 *  - SKU (`product.code`) and product name are surfaced under the image;
 *    the SKU acts as a stable secondary identifier shoppers can quote
 *    over the phone.
 *
 *  - Image preflight: if the hero image 404s (or is the local placeholder
 *    SVG for any reason), the card hides itself entirely. This stops
 *    "no image" cards from leaking past the URL-level filtering done in
 *    the data hooks. Pass `onImageInvalid(productId)` to be notified so
 *    parent grids can also drop the card from their lists.
 */

const isLocalPlaceholder = (src) => {
  if (!src) return true
  const s = String(src).toLowerCase()
  return (
    s.endsWith('placeholder-product.svg') ||
    s.includes('/placeholder-product.svg') ||
    s === PRODUCT_PLACEHOLDER ||
    s.endsWith('default.jpg') ||
    s.endsWith('default.png')
  )
}

/**
 * Preflight an image URL — resolves to true when the browser successfully
 * loads it, false on error or if the URL is a known placeholder. Cached in
 * memory so we never load the same image twice across cards.
 */
const imagePreflightCache = new Map()

function preflightImage(src) {
  if (!src) return Promise.resolve(false)
  if (isLocalPlaceholder(src)) return Promise.resolve(false)
  if (imagePreflightCache.has(src)) return imagePreflightCache.get(src)

  const promise = new Promise((resolve) => {
    const img = new Image()
    let settled = false
    const finish = (ok) => {
      if (settled) return
      settled = true
      resolve(ok)
    }
    img.onload = () => finish(true)
    img.onerror = () => finish(false)
    img.src = src
    // Safety: don't hold the card hostage if the network never resolves.
    setTimeout(() => finish(true), 8000)
  })

  imagePreflightCache.set(src, promise)
  return promise
}

export default function ProductCard({ product, onImageInvalid }) {
  const { toggleWishlist, isInWishlist } = useStore()
  const wishlisted = isInWishlist(product.id)

  const heroSrc = product.images?.[0]
  // Three-state: 'pending' | 'ok' | 'invalid' — prevents flash of placeholder.
  const [imageState, setImageState] = useState(() =>
    isLocalPlaceholder(heroSrc) ? 'invalid' : 'pending',
  )

  useEffect(() => {
    let cancelled = false
    setImageState(isLocalPlaceholder(heroSrc) ? 'invalid' : 'pending')

    if (!heroSrc || isLocalPlaceholder(heroSrc)) {
      onImageInvalid?.(product.id)
      return () => {
        cancelled = true
      }
    }

    preflightImage(heroSrc).then((ok) => {
      if (cancelled) return
      if (ok) {
        setImageState('ok')
      } else {
        setImageState('invalid')
        onImageInvalid?.(product.id)
      }
    })

    return () => {
      cancelled = true
    }
  }, [heroSrc, product.id, onImageInvalid])

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  // Don't render the card at all when the image is known-bad. Returning
  // `null` lets the parent grid collapse the slot cleanly.
  if (imageState === 'invalid') return null

  return (
    <motion.article
      className="group relative"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      layout
      style={{ opacity: imageState === 'pending' ? 0 : 1, transition: 'opacity 250ms ease' }}
    >
      <Link
        to={productUrl(product)}
        className="block"
        id={`product-${product.id}-link`}
        aria-label={`View details for ${product.name}`}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-xl mb-4 aspect-[4/5]"
          style={{ background: 'var(--color-charcoal)' }}
        >
          <motion.div className="w-full h-full" variants={imageZoom}>
            <ProductImage
              src={heroSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* "View Details" affordance on hover — replaces the old quick-view
            * + add-to-bag pair. Pointer-events disabled so it doesn't block
            * the underlying link click. */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 40%, rgba(10, 10, 10, 0.7))',
            }}
          >
            <span
              className="h-11 pl-6 pr-6 rounded-full flex items-center justify-center gap-2 text-xs font-medium tracking-[0.08em] uppercase"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-obsidian)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              View Details <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          </div>

          {/* Wishlist button — only foreground action that intercepts the
            * card link. */}
          <motion.button
            type="button"
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10"
            style={{
              background: wishlisted ? 'var(--color-gold)' : 'rgba(10, 10, 10, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
            id={`product-${product.id}-wishlist`}
          >
            <Heart
              size={16}
              strokeWidth={wishlisted ? 0 : 1.5}
              fill={wishlisted ? 'var(--color-obsidian)' : 'none'}
              style={{ color: wishlisted ? 'var(--color-obsidian)' : 'var(--color-ivory)' }}
            />
          </motion.button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span
                className="pl-3 pr-3 pt-1 pb-1 rounded-full text-[0.6rem] font-semibold tracking-[0.15em] uppercase"
                style={{
                  background: 'var(--color-gold)',
                  color: 'var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                New
              </span>
            )}
            {product.originalPrice && (
              <span
                className="pl-3 pr-3 pt-1 pb-1 rounded-full text-[0.6rem] font-semibold tracking-[0.15em] uppercase"
                style={{
                  background: 'var(--color-maroon)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Product info */}
        {/* SKU + collection eyebrow — code is the primary identifier when
          * mock-style "collection" copy isn't available. */}
        <p
          className="text-[0.65rem] tracking-[0.2em] uppercase mb-1 truncate"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-gold)' }}
        >
          {product.code ? `SKU · ${product.code}` : product.collection}
        </p>
        <h3
          className="text-lg mb-1 transition-colors duration-300 group-hover:text-gold line-clamp-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontWeight: 500 }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory)' }}
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span
              className="text-sm line-through"
              style={{ fontFamily: 'var(--font-sans)', color: 'rgba(245, 240, 232, 0.4)' }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="text-xs"
                style={{ color: i < Math.round(product.rating) ? 'var(--color-gold)' : 'var(--color-slate)' }}
              >
                ★
              </span>
            ))}
            <span className="text-xs ml-1" style={{ color: 'var(--color-ivory-muted)' }}>
              ({product.reviewCount})
            </span>
          </div>
        )}
      </Link>
    </motion.article>
  )
}
