import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CalendarRange, ChevronRight, Heart, ShoppingBag,
  Truck, Shield, RotateCcw, Sparkles, Info,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import { breadcrumbSchema, productSchema } from '@/seo/schemas'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import ProductCard from '@/components/ui/ProductCard'
import ProductImage, { PRODUCT_PLACEHOLDER } from '@/components/ui/ProductImage'
import DateRangePicker from '@/components/ui/DateRangePicker'
import { RENTAL_DURATIONS } from '@/utils/constants'
import {
  addDays, dailyRentalRate, formatDate, formatPrice, parseProductSlug,
  parseProductSlugName, productUrl, rentalChargeFromBase, rentalDays,
  securityDeposit,
} from '@/utils/helpers'
import useStore from '@/store/useStore'
import useProduct from '@/hooks/useProduct'
import useProducts from '@/hooks/useProducts'
import { staggerContainer, staggerItem } from '@/animations/variants'

const SITE_ORIGIN = 'https://srishringaar.com'
const DEFAULT_DURATION = 3 // days — matches legacy default and the rent_price contract

/**
 * The legacy backend's `rent_price` represents the total charge for a 3-day
 * rental, not a per-day rate. Day counts above 3 add a 5% premium per
 * extra day. See `rentalChargeFromBase` in @/utils/helpers.
 */
const BASE_RENTAL_DAYS = 3

// Rental booking constraints — applied uniformly across the page.
const LEAD_TIME_DAYS = 7   // earliest pickup is 7 days from today
const MIN_RENTAL_DAYS = 3
const MAX_RENTAL_DAYS = 7
const MAX_LOOKAHEAD_DAYS = 180

/**
 * Stub for booked-date lookups. Wire this to the real availability API
 * when it lands — for now we assume nothing is booked.
 *
 * @param {Date} _date
 * @param {object} _product
 * @returns {boolean}
 */
function isDateBooked(_date, _product) {
  return false
}

export default function ProductDetails() {
  const { slug } = useParams()
  const productId = parseProductSlug(slug)
  const productName = parseProductSlugName(slug)

  const { product, isLoading, error, refetch } = useProduct({
    id: productId,
    name: productName,
    enabled: productId != null,
  })

  const [activeImage, setActiveImage] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState(DEFAULT_DURATION)
  const [orderMode, setOrderMode] = useState('rent') // 'rent' | 'buy'

  const [dateRange, setDateRange] = useState(() => {
    // Default pickup is the earliest allowed date (today + lead time), with
    // the minimum rental length already filled in. Users can override either
    // end via the picker.
    const start = addDays(new Date(), LEAD_TIME_DAYS)
    return { start, end: addDays(start, DEFAULT_DURATION - 1) }
  })

  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const showToast = useStore((s) => s.showToast)

  // Reset thumbnail selection when the underlying product changes
  useEffect(() => {
    setActiveImage(0)
  }, [product?.id])

  // Track product view
  useEffect(() => {
    if (!product?.id) return
    const params = new URLSearchParams(window.location.search)
    fetch(`/API/v1/track-view.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        referrer: document.referrer,
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
      }),
    }).catch(() => {}) // Fire and forget — don't block UI
  }, [product?.id, product?.name, product?.type])

  /* ── Loading / error / not-found views ──────────────────────────────── */

  if (productId == null) return <NotFoundState />
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error.message} onRetry={refetch} />
  if (!product) return <NotFoundState />

  /* ── Derived data ───────────────────────────────────────────────────── */

  const galleryImages = product.images?.length ? product.images : [PRODUCT_PLACEHOLDER]
  const primaryImage = galleryImages[0]
  const wishlisted = isInWishlist(product.id)

  // Coarse type → display label + collection page
  const displayCategory = product.category
    || (product.type === 'garments' ? 'Bridal Wear' : 'Jewellery')
  const collectionRoot = product.type === 'garments' ? '/bridal' : '/jewellery'

  // Pricing model (mirrors legacy storefront):
  //   - `rent_price` from the API is the total charge for BASE_RENTAL_DAYS
  //     (3 days). We never divide by days — that produces a misleading
  //     "per day" headline.
  //   - For longer rentals, add 5% per extra day.
  //   - Deposit is whatever the API returns.
  const baseRentPrice = product.rentPrice ?? dailyRentalRate(product.mrp ?? product.price) * BASE_RENTAL_DAYS
  const actualDays = rentalDays(dateRange.start, dateRange.end) || selectedDuration
  const rentTotalValue = rentalChargeFromBase(baseRentPrice, actualDays)
  const deposit = product.deposit ?? securityDeposit(product.mrp ?? product.price)
  const grandTotal = rentTotalValue + deposit

  const canonicalPath = productUrl(product)
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`

  /* ── Handlers ───────────────────────────────────────────────────────── */

  const handleDateChange = (next) => {
    setDateRange(next)
    if (next.start && next.end) {
      const days = rentalDays(next.start, next.end)
      setSelectedDuration(RENTAL_DURATIONS.includes(days) ? days : null)
    } else if (!next.start && !next.end) {
      // Cleared — keep the duration pill so re-picking starts fresh.
      // No-op.
    }
  }

  /**
   * Validation hook handed to <DateRangePicker />. Runs once the user has
   * picked both ends of the range and either accepts (returns null) or
   * rejects with a human-readable message that the picker shows via the
   * `onInvalid` toast bridge.
   */
  const validateRange = ({ start, end }) => {
    if (!start || !end) return null

    const days = rentalDays(start, end)
    if (days < MIN_RENTAL_DAYS) {
      return `Minimum rental duration is ${MIN_RENTAL_DAYS} days. Please pick a longer window.`
    }
    if (days > MAX_RENTAL_DAYS) {
      return `Maximum rental duration is ${MAX_RENTAL_DAYS} days. Please pick a shorter window.`
    }

    // Walk every day in the range to catch booked dates spanned by an
    // otherwise-valid pickup/return pair.
    if (product) {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (isDateBooked(d, product)) {
          return 'This piece is already reserved for some of your selected dates. Please choose another window.'
        }
      }
    }

    return null
  }

  const handleDurationChange = (days) => {
    if (days < MIN_RENTAL_DAYS || days > MAX_RENTAL_DAYS) return
    setSelectedDuration(days)
    const start = dateRange.start || addDays(new Date(), LEAD_TIME_DAYS)
    setDateRange({ start, end: addDays(start, days - 1) })
  }

  const handleAddToBag = () => {
    // Final guard before the toast surfaces — should be impossible to hit
    // through the UI thanks to the picker validation, but keep it as a
    // belt-and-braces for keyboard / programmatic input.
    const issue = validateRange({ start: dateRange.start, end: dateRange.end })
    if (issue) {
      showToast(issue, { type: 'error' })
      return
    }
    addToCart(
      {
        ...product,
        orderType: 'rent',
        rental: {
          days: actualDays,
          startDate: dateRange.start,
          endDate: dateRange.end,
          baseRentPrice,
          rentTotal: rentTotalValue,
          deposit,
        },
        // Override price so cart math works with the rental amount
        price: rentTotalValue,
      },
      1
    )
    showToast(`Reserved ${product.name} for ${actualDays} days.`, { type: 'success' })
  }

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,
        orderType: 'purchase',
        rental: null,
        // Use sale price for purchase
        price: product.salePrice ?? product.mrp ?? product.price,
      },
      1
    )
    showToast(`Added ${product.name} to cart for purchase.`, { type: 'success' })
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: displayCategory, url: collectionRoot },
    { name: product.name, url: canonicalPath },
  ]

  return (
    <>
      <SEO
        title={`${product.name} — Rent ${displayCategory}`}
        description={product.description || `Rent ${product.name} from Sri Shringaar's heritage atelier.`}
        keywords={[product.name, displayCategory, product.code, 'rent jewellery', 'bridal rental']
          .filter(Boolean)
          .join(', ')}
        image={primaryImage}
        canonical={canonicalUrl}
        type="product"
        schema={[
          productSchema(
            {
              ...product,
              category: displayCategory,
              description: product.description || product.name,
            },
            { canonicalUrl }
          ),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center flex-wrap gap-2 text-xs tracking-[0.08em] uppercase"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)' }}
          >
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <span key={crumb.url} className="flex items-center gap-2">
                  {isLast ? (
                    <span style={{ color: 'var(--color-gold)' }} aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      to={crumb.url}
                      className="transition-colors duration-300 hover:text-gold cursor-pointer"
                      style={{ color: 'var(--color-ivory-muted)' }}
                    >
                      {crumb.name}
                    </Link>
                  )}
                  {!isLast && <ChevronRight size={12} style={{ color: 'rgba(245, 240, 232, 0.3)' }} />}
                </span>
              )
            })}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Image gallery — sticky on desktop so the long pricing panel can scroll past it */}
            <motion.div
              className="flex flex-col-reverse md:flex-row gap-4 md:sticky md:top-28"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {galleryImages.length > 1 && (
                <div
                  className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] scrollbar-hide shrink-0"
                  role="tablist"
                  aria-label="Product images"
                >
                  {galleryImages.map((src, i) => (
                    <button
                      key={src + i}
                      role="tab"
                      aria-selected={i === activeImage}
                      aria-label={`Show image ${i + 1} of ${galleryImages.length}`}
                      onClick={() => setActiveImage(i)}
                      className="shrink-0 overflow-hidden rounded-lg transition-all duration-300 cursor-pointer"
                      style={{
                        width: '68px',
                        height: '85px',
                        border: i === activeImage
                          ? '1px solid var(--color-gold)'
                          : '1px solid rgba(201, 169, 110, 0.15)',
                        opacity: i === activeImage ? 1 : 0.55,
                        background: 'var(--color-charcoal)',
                      }}
                    >
                      <ProductImage
                        src={src}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image — capped so wide viewports don't blow up the gallery.
                * Hover triggers a 2x zoom following the cursor (matches the legacy
                * storefront's lens behaviour). */}
              <ZoomImage
                src={galleryImages[activeImage]}
                imageKey={activeImage}
                alt={`${product.name} — ${displayCategory}`}
                inStock={product.inStock}
              />
            </motion.div>

            {/* Right column — info, pricing, CTA */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="label-text mb-3" style={{ color: 'var(--color-gold)' }}>
                {displayCategory}
                {product.code && (
                  <span className="ml-2" style={{ color: 'var(--color-ivory-muted)' }}>
                    · {product.code}
                  </span>
                )}
              </p>

              <h1
                className="heading-md mb-4"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
              >
                {product.name}
              </h1>

              <div
                className="flex items-baseline gap-3 mb-2"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <meta itemProp="priceCurrency" content="INR" />
                <meta itemProp="price" content={rentTotalValue} />
                <meta
                  itemProp="availability"
                  content={
                    product.inStock
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock'
                  }
                />
                <span
                  className="text-3xl font-semibold"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                >
                  {formatPrice(rentTotalValue)}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                  / {actualDays} {actualDays === 1 ? 'day' : 'days'} rental
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-ivory-muted)' }}>
                MRP {formatPrice(product.mrp ?? product.price)}
                {product.originalPrice && product.originalPrice !== product.mrp && (
                  <>
                    {' '}
                    <span className="line-through">{formatPrice(product.originalPrice)}</span>
                  </>
                )}
              </p>

              {/* Inventory indicator — surfaces real stock counts so shoppers
                * know whether to act fast. Tone shifts based on the count:
                * green for healthy, amber for low (≤2), red when sold out. */}
              <StockBadge inventory={product.inventory} inStock={product.inStock} />

              <div className="luxury-divider mb-8 mt-6" style={{ opacity: 0.15 }} />

              {/* Rent / Buy mode toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setOrderMode('rent')}
                  className="flex-1 py-3 rounded-lg text-xs tracking-[0.1em] uppercase font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: orderMode === 'rent' ? 'var(--color-gold)' : 'transparent',
                    color: orderMode === 'rent' ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                    border: `1px solid ${orderMode === 'rent' ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
                  }}
                >
                  Rent
                </button>
                <button
                  type="button"
                  onClick={() => setOrderMode('buy')}
                  className="flex-1 py-3 rounded-lg text-xs tracking-[0.1em] uppercase font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: orderMode === 'buy' ? 'var(--color-gold)' : 'transparent',
                    color: orderMode === 'buy' ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                    border: `1px solid ${orderMode === 'buy' ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
                  }}
                >
                  Buy
                </button>
              </div>

              {orderMode === 'rent' ? (
                <>
                  <div className="mb-6">
                    <p
                      className="label-text mb-3 flex items-center gap-2"
                      style={{ color: 'var(--color-ivory-muted)' }}
                    >
                      <CalendarRange size={14} /> Rental Duration
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {RENTAL_DURATIONS.map((d) => {
                        const active = selectedDuration === d
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleDurationChange(d)}
                            className="pl-4 pr-4 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              background: active ? 'var(--color-gold)' : 'transparent',
                              color: active ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                              border: `1px solid ${active ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
                              fontWeight: active ? 600 : 400,
                            }}
                            aria-pressed={active}
                          >
                            {d} {d === 1 ? 'Day' : 'Days'}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <DateRangePicker
                      value={dateRange}
                      onChange={handleDateChange}
                      minDate={addDays(new Date(), LEAD_TIME_DAYS)}
                      maxDate={addDays(new Date(), MAX_LOOKAHEAD_DAYS)}
                      isDateDisabled={(d) => isDateBooked(d, product)}
                      validateRange={validateRange}
                      onInvalid={(message) => showToast(message, { type: 'error' })}
                    />
                    <p
                      className="mt-2 text-[0.7rem] tracking-[0.04em]"
                      style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                    >
                      Earliest pickup is {LEAD_TIME_DAYS} days from today. Rentals
                      run {MIN_RENTAL_DAYS}–{MAX_RENTAL_DAYS} days.
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-5 mb-8"
                    style={{
                      background: 'rgba(201, 169, 110, 0.06)',
                      border: '1px solid rgba(201, 169, 110, 0.15)',
                    }}
                  >
                    <div
                      className="flex items-center justify-between mb-3 text-sm"
                      style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                    >
                      <span>
                        Rental for {actualDays} {actualDays === 1 ? 'day' : 'days'}
                        {actualDays > BASE_RENTAL_DAYS && (
                          <span className="ml-1" style={{ color: 'var(--color-gold)', opacity: 0.7 }}>
                            (incl. {actualDays - BASE_RENTAL_DAYS}-day premium)
                          </span>
                        )}
                      </span>
                      <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(rentTotalValue)}</span>
                    </div>
                    <div
                      className="flex items-center justify-between mb-3 text-sm"
                      style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                    >
                      <span className="flex items-center gap-1">
                        Refundable Deposit
                        <Info size={12} aria-label="Returned after the piece is returned in good condition." />
                      </span>
                      <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(deposit)}</span>
                    </div>
                    <div
                      className="pt-3 mt-3 flex items-center justify-between"
                      style={{ borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}
                    >
                      <span className="label-text" style={{ color: 'var(--color-ivory)' }}>
                        Payable Now
                      </span>
                      <span
                        className="text-xl font-semibold"
                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                      >
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    {dateRange.start && dateRange.end && (
                      <p
                        className="mt-3 text-xs"
                        style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                      >
                        Pickup {formatDate(dateRange.start)} • Return {formatDate(dateRange.end)}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 mb-10">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleAddToBag}
                      disabled={!product.inStock}
                      id="product-add-to-bag"
                    >
                      <ShoppingBag size={16} />{' '}
                      {product.inStock
                        ? `Reserve for ${actualDays} ${actualDays === 1 ? 'Day' : 'Days'}`
                        : 'Unavailable'}
                    </Button>
                    <motion.button
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
                      style={{
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        background: wishlisted ? 'var(--color-gold)' : 'transparent',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product)}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      aria-pressed={wishlisted}
                      id="product-wishlist-toggle"
                    >
                      <Heart
                        size={18}
                        fill={wishlisted ? 'var(--color-obsidian)' : 'none'}
                        style={{ color: wishlisted ? 'var(--color-obsidian)' : 'var(--color-gold)' }}
                      />
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  {/* Purchase mode */}
                  <div
                    className="rounded-xl p-5 mb-8"
                    style={{
                      background: 'rgba(201, 169, 110, 0.06)',
                      border: '1px solid rgba(201, 169, 110, 0.15)',
                    }}
                  >
                    <div
                      className="flex items-center justify-between mb-3 text-sm"
                      style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                    >
                      <span>Purchase Price</span>
                      <span
                        className="text-xl font-semibold"
                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                      >
                        {formatPrice(product.salePrice ?? product.mrp ?? product.price)}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <div
                        className="flex items-center justify-between text-sm"
                        style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                      >
                        <span>MRP</span>
                        <span className="line-through">{formatPrice(product.originalPrice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mb-10">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleBuyNow}
                      disabled={!product.inStock}
                      id="product-buy-now"
                    >
                      <ShoppingBag size={16} />{' '}
                      {product.inStock ? 'Add to Cart — Purchase' : 'Unavailable'}
                    </Button>
                    <motion.button
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
                      style={{
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        background: wishlisted ? 'var(--color-gold)' : 'transparent',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product)}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      aria-pressed={wishlisted}
                      id="product-wishlist-toggle-buy"
                    >
                      <Heart
                        size={18}
                        fill={wishlisted ? 'var(--color-obsidian)' : 'none'}
                        style={{ color: wishlisted ? 'var(--color-obsidian)' : 'var(--color-gold)' }}
                      />
                    </motion.button>
                  </div>
                </>
              )}

              <ul className="grid grid-cols-3 gap-4 list-none">
                {[
                  { icon: Truck, label: 'Doorstep Delivery', sub: 'Free above ₹50,000' },
                  { icon: Shield, label: 'Sanitised', sub: 'Cleaned before dispatch' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: 'Pickup arranged' },
                ].map(({ icon: Icon, label, sub }) => (
                  <li key={label} className="glass-gold rounded-xl p-4 text-center">
                    <Icon size={20} className="ml-auto mr-auto mb-2" style={{ color: 'var(--color-gold)' }} />
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                    </p>
                    <p className="text-[0.6rem] mt-0.5" style={{ color: 'var(--color-ivory-muted)' }}>
                      {sub}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product description — full-width section so long copy stays readable
        * without crowding the right-rail pricing panel. Hidden when the API
        * returned no `product_desc`. */}
      {product.description && (
        <section
          className="pt-16 pb-16"
          style={{
            background: 'var(--color-obsidian)',
            borderTop: '1px solid rgba(201, 169, 110, 0.08)',
          }}
          aria-labelledby="product-description-heading"
        >
          <div className="container-luxury">
            <div className="max-w-3xl">
              <p
                className="label-text mb-3"
                style={{ color: 'var(--color-gold)' }}
              >
                Product Details
              </p>
              <h2
                id="product-description-heading"
                className="heading-md mb-6"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
              >
                About this piece
              </h2>
              <p
                className="body-lg"
                style={{ color: 'var(--color-ivory-muted)', lineHeight: 1.8 }}
                itemProp="description"
              >
                {product.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* You May Also Like — same-collection recommendations from the API */}
      <RelatedProducts product={product} />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * RelatedProducts
 *
 * Strategy:
 *   - Jewellery uses `category=jewel_child:<cat_id>` for sibling lookups.
 *   - Garments reuse the listing filter `category=garment:<cat_id>`.
 *
 * We exclude the current product, slice the first 4, and skip the section
 * entirely when we can't form a query (missing cat_id) or there's nothing
 * else in the collection to show.
 * ──────────────────────────────────────────────────────────────────────────── */
function RelatedProducts({ product }) {
  const [hiddenIds, setHiddenIds] = useState(new Set())

  const handleImageInvalid = useCallback((id) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const categoryQuery = useMemo(() => {
    if (product?.catId == null) return null
    if (product.type === 'garments') return `garment:${product.catId}`
    return `jewel_child:${product.catId}`
  }, [product?.catId, product?.type])

  const { items, isLoading, error } = useProducts({
    category: categoryQuery,
    page: 1,
    sort: 'sku_desc',
    enabled: Boolean(categoryQuery),
  })

  if (!categoryQuery || error) return null

  // Drop the current product and cap to four cards
  const related = items.filter((p) => String(p.id) !== String(product.id)).slice(0, 4)

  // Only show skeletons on the very first load — once we know there's nothing
  // to recommend, we hide the section entirely instead of rendering an empty
  // grid that would feel like a UI bug.
  if (!isLoading && related.length === 0) return null

  return (
    <section
      className="pt-20 pb-20"
      style={{ background: 'var(--color-charcoal)' }}
      aria-labelledby="related-heading"
    >
      <div className="container-luxury">
        <div className="text-center mb-12">
          <SplitText
            as="h2"
            className="heading-md mb-3"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            You May Also Like
          </SplitText>
          <p
            className="body-lg max-w-xl ml-auto mr-auto"
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            Discover more pieces from this collection that complement your selection perfectly.
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <RelatedSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {related.map((p, i) => (
              <motion.div key={p.id} variants={staggerItem} style={{ display: hiddenIds.has(p.id) ? 'none' : undefined }}>
                <ProductCard product={p} index={i} onImageInvalid={handleImageInvalid} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function RelatedSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="aspect-[4/5] rounded-xl mb-4"
        style={{ background: 'rgba(201, 169, 110, 0.06)' }}
      />
      <div className="h-3 rounded w-1/3 mb-2" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
      <div className="h-4 rounded w-3/4 mb-2" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
      <div className="h-4 rounded w-1/4" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Auxiliary states & helpers
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * StockBadge — coloured pill summarising current inventory.
 *
 * Tone reflects urgency:
 *   - inventory > 2  → calm gold ("In Stock · N available")
 *   - 0 < inv ≤ 2    → amber warning ("Only N left")
 *   - inventory = 0  → maroon ("Currently Unavailable")
 */
function StockBadge({ inventory, inStock }) {
  const count = Number(inventory) || 0
  const isLow = inStock && count > 0 && count <= 2

  let bg = 'rgba(70, 130, 90, 0.12)'
  let border = 'rgba(70, 130, 90, 0.4)'
  let color = '#9be0b3'
  let dot = '#7bc88f'
  let text = `In Stock · ${count} ${count === 1 ? 'piece' : 'pieces'} available`

  if (!inStock || count === 0) {
    bg = 'rgba(128, 0, 32, 0.12)'
    border = 'rgba(220, 80, 100, 0.35)'
    color = '#ff8a9c'
    dot = '#ff6f80'
    text = 'Currently Unavailable'
  } else if (isLow) {
    bg = 'rgba(201, 145, 50, 0.12)'
    border = 'rgba(220, 165, 65, 0.4)'
    color = '#ffd187'
    dot = '#ffb449'
    text = `Only ${count} ${count === 1 ? 'piece' : 'pieces'} left`
  }

  return (
    <div
      className="inline-flex items-center gap-2 pl-3 pr-3 pt-1.5 pb-1.5 rounded-full text-xs"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontFamily: 'var(--font-sans)',
      }}
      role="status"
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
      />
      {text}
    </div>
  )
}

/**
 * ZoomImage — main product image with cursor-tracking 2× zoom on hover.
 *
 * The lens effect is achieved by translating `transform-origin` to follow
 * the mouse, then scaling the image. Touch devices skip the zoom (no hover
 * means the constant scaled state would be unusable).
 */
function ZoomImage({ src, imageKey, alt, inStock }) {
  const [origin, setOrigin] = useState('50% 50%')
  const [hovering, setHovering] = useState(false)
  const [resolvedSrc, setResolvedSrc] = useState(src || PRODUCT_PLACEHOLDER)
  const [didFallback, setDidFallback] = useState(!src)

  // Sync local fallback state when the gallery thumbnail changes.
  useEffect(() => {
    setResolvedSrc(src || PRODUCT_PLACEHOLDER)
    setDidFallback(!src)
  }, [src])

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  const handleError = () => {
    if (didFallback) return
    setResolvedSrc(PRODUCT_PLACEHOLDER)
    setDidFallback(true)
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl flex-1 aspect-[4/5] max-h-[640px] mx-auto w-full"
      style={{
        background: 'var(--color-charcoal)',
        maxWidth: '520px',
        cursor: 'zoom-in',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        setOrigin('50% 50%')
      }}
      onMouseMove={handleMove}
    >
      <motion.img
        src={resolvedSrc}
        alt={alt}
        className="w-full h-full object-cover"
        key={imageKey}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: hovering ? 2 : 1 }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
        }}
        style={{ transformOrigin: origin, willChange: 'transform' }}
        width={1200}
        height={1500}
        onError={handleError}
      />

      <div
        className="absolute top-4 left-4 flex items-center gap-2 pl-3 pr-3 pt-1.5 pb-1.5 rounded-full text-[0.65rem] tracking-[0.12em] uppercase pointer-events-none"
        style={{
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(8px)',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-sans)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
        }}
      >
        <Sparkles size={12} /> Available for Rent
      </div>

      {!inStock && (
        <div
          className="absolute bottom-4 left-4 pl-3 pr-3 pt-1.5 pb-1.5 rounded-full text-[0.65rem] tracking-[0.12em] uppercase pointer-events-none"
          style={{
            background: 'rgba(128, 0, 32, 0.85)',
            color: 'var(--color-ivory)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Currently Unavailable
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <section
      className="min-h-[60vh] flex items-center justify-center"
      style={{ background: 'var(--color-obsidian)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(201, 169, 110, 0.2)', borderTopColor: 'var(--color-gold)' }}
        />
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
        >
          Loading Product
        </span>
      </div>
    </section>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
      <div className="container-luxury text-center pt-16 pb-16">
        <SplitText
          className="heading-md mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
        >
          Couldn't load this product
        </SplitText>
        <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
          {message}
        </p>
        <button
          onClick={onRetry}
          className="pl-5 pr-5 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase cursor-pointer"
          style={{
            fontFamily: 'var(--font-sans)',
            background: 'var(--color-gold)',
            color: 'var(--color-obsidian)',
          }}
        >
          Retry
        </button>
      </div>
    </section>
  )
}

function NotFoundState() {
  return (
    <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
      <div className="container-luxury text-center pt-16 pb-16">
        <SplitText
          className="heading-md mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
        >
          We couldn't find that piece
        </SplitText>
        <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
          It may have been retired from our atelier. Browse our latest pieces below.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            to="/jewellery"
            className="pl-5 pr-5 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase"
            style={{
              fontFamily: 'var(--font-sans)',
              background: 'var(--color-gold)',
              color: 'var(--color-obsidian)',
            }}
          >
            Browse Jewellery
          </Link>
          <Link
            to="/bridal"
            className="pl-5 pr-5 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase"
            style={{
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--color-gold)',
              color: 'var(--color-gold)',
            }}
          >
            Browse Bridal Wear
          </Link>
        </div>
      </div>
    </section>
  )
}
