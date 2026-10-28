import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Heart, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '@/store/useStore'
import { formatPrice, productUrl } from '@/utils/helpers'
import ProductImage, { PRODUCT_PLACEHOLDER, proxyUrl } from '@/components/ui/ProductImage'
import ComparisonButton from '@/components/ui/ComparisonButton'

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
 *
 *  - On hover: images auto-cycle sequentially (0 → 1 → 2 → … → 0).
 *    Each image waits until loaded, then displays for 3 seconds.
 *    Small bullet dots at the bottom show the active image.
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
  // Skip network preflight — let ProductImage handle errors via onError fallback.
  // This avoids double-loading every image (once for check, once for display).
  return Promise.resolve(true)
}

export default function ProductCard({ product, onImageInvalid }) {
  const { toggleWishlist, isInWishlist } = useStore()
  const wishlisted = isInWishlist(product.id)

  // Stable images array — only recomputes when the product id changes
  const images = useMemo(() => {
    const raw =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image, product.details?.image_path].filter(Boolean)
    return raw.filter((img) => !isLocalPlaceholder(img))
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const heroSrc = images[0]
  const hasMultiple = images.length > 1

  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Track loaded image URLs via ref (no re-render on load) + a simple
  // boolean state for the *current* image only (minimal re-renders).
  const loadedSetRef = useRef(new Set())
  const [currentLoaded, setCurrentLoaded] = useState(true) // hero is assumed loaded after preflight

  const currentSrc = images[activeIdx] || heroSrc

  // Three-state: 'pending' | 'ok' | 'invalid' — prevents flash of placeholder.
  const [imageState, setImageState] = useState(() =>
    isLocalPlaceholder(heroSrc) ? 'invalid' : 'pending',
  )

  useEffect(() => {
    let cancelled = false
    setImageState(isLocalPlaceholder(heroSrc) ? 'invalid' : 'pending')

    if (!heroSrc || isLocalPlaceholder(heroSrc)) {
      onImageInvalid?.(product.id)
      return () => { cancelled = true }
    }

    preflightImage(heroSrc).then((ok) => {
      if (cancelled) return
      if (ok) {
        setImageState('ok')
        loadedSetRef.current.add(heroSrc)
      } else {
        setImageState('invalid')
        onImageInvalid?.(product.id)
      }
    })

    return () => { cancelled = true }
  }, [heroSrc, product.id, onImageInvalid])

  // When activeIdx changes, check if new image is already cached
  useEffect(() => {
    setCurrentLoaded(loadedSetRef.current.has(currentSrc))
  }, [currentSrc])

  // Preload all secondary images in background on first hover
  const didPreloadRef = useRef(false)
  useEffect(() => {
    if (!isHovered || !hasMultiple || didPreloadRef.current) return
    didPreloadRef.current = true

    images.forEach((src) => {
      if (src && !loadedSetRef.current.has(src)) {
        const img = new Image()
        img.onload = () => {
          loadedSetRef.current.add(src)
          // If this was the image we're currently waiting on, flip the flag
          setActiveIdx((cur) => {
            if (images[cur] === src) setCurrentLoaded(true)
            return cur // don't actually change index
          })
        }
        img.src = src
      }
    })
  }, [isHovered, hasMultiple, images])

  // Auto-advance: wait for loaded, then hold 3 seconds, then next
  useEffect(() => {
    if (!isHovered || !hasMultiple || !currentLoaded) return

    const timer = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isHovered, hasMultiple, currentLoaded, activeIdx, images.length])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setActiveIdx(0)
    setCurrentLoaded(true) // hero is always loaded
  }, [])

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  // Called by ProductImage's underlying <img> onLoad
  const handleImageLoad = useCallback(() => {
    loadedSetRef.current.add(currentSrc)
    setCurrentLoaded(true)
  }, [currentSrc])

  // Don't render the card at all when the image is known-bad.
  if (imageState === 'invalid') return null

  // When pending, hide visually but don't take up space
  if (imageState === 'pending') return null

  return (
    <article
      className="group relative transition-transform duration-400 ease-out hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={productUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        id={`product-${product.id}-link`}
        aria-label={`View details for ${product.name}`}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-xl mb-4 aspect-[2/3]"
          style={{ background: 'var(--color-charcoal)' }}
        >
          <div className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-[1.08]">
            {/* Blurred Background to fill empty spaces — tiny 80px micro-thumbnail */}
            <img
              src={proxyUrl(currentSrc, 80)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-30 scale-105 pointer-events-none"
            />
            {/* Main Contain Image to show full product details */}
            <ProductImage
              key={currentSrc}
              src={currentSrc}
              alt={product.name}
              className={`relative w-full h-full object-contain z-10 transition-opacity duration-500 ${
                currentLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
            />
          </div>

          {/* Loading indicator — only while hovered and waiting for a new image */}
          {isHovered && !currentLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-[11px] tracking-[0.15em] uppercase font-medium"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(201,169,110,0.4)',
                  color: 'var(--color-gold)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span
                  className="w-3 h-3 rounded-full animate-spin"
                  style={{
                    border: '2px solid var(--color-gold)',
                    borderTopColor: 'transparent',
                  }}
                />
                Loading…
              </div>
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            <button
              onClick={handleWishlistClick}
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer"
              style={{
                background: wishlisted ? 'var(--color-gold)' : 'rgba(10, 10, 10, 0.6)',
                border: wishlisted ? '1px solid var(--color-gold)' : '1px solid rgba(201, 169, 110, 0.3)',
                color: wishlisted ? 'var(--color-obsidian)' : 'var(--color-ivory)',
              }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <ComparisonButton product={product} variant="icon" size="md" />
          </div>

          {/* "View Details" affordance on hover */}
          <div
            className="absolute inset-0 z-20 flex items-end justify-center pb-9 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 35%, rgba(10, 10, 10, 0.75))',
            }}
          >
            <span
              className="h-9 pl-5 pr-5 rounded-full flex items-center justify-center gap-2 text-xs font-medium tracking-[0.08em] uppercase shadow-lg backdrop-blur-sm"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-obsidian)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              View Details <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          </div>

          {/* Pagination bullets */}
          {hasMultiple && (
            <div className="absolute bottom-2.5 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: activeIdx === idx ? 16 : 6,
                      height: 6,
                      background:
                        activeIdx === idx
                          ? 'var(--color-gold)'
                          : 'rgba(255,255,255,0.4)',
                      boxShadow:
                        activeIdx === idx
                          ? '0 0 8px rgba(201,169,110,0.6)'
                          : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
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
        <div className="flex flex-col gap-1 mt-1">
          {/* Rent price (primary) */}
          {(product.availability || 'both') !== 'sell' && (
            <div className="flex items-center gap-2">
              <span
                className="text-[0.6rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(201, 169, 110, 0.15)', color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
              >
                Rent
              </span>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory)' }}
              >
                {formatPrice(product.rentPrice || product.price)}
              </span>
            </div>
          )}
          {/* Sale/Buy price */}
          {(product.availability || 'both') !== 'rent' && (
            <div className="flex items-center gap-2">
              <span
                className="text-[0.6rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(93, 26, 27, 0.3)', color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
              >
                Buy
              </span>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)' }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span
                  className="text-xs line-through"
                  style={{ fontFamily: 'var(--font-sans)', color: 'rgba(245, 240, 232, 0.6)' }}
                >
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
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
    </article>
  )
}
