import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GitCompare, X, ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '@/seo/SEO'
import Button from '@/components/ui/Button'
import ProductImage from '@/components/ui/ProductImage'
import useComparisonStore, { MAX_COMPARISON_ITEMS } from '@/store/useComparisonStore'
import useStore from '@/store/useStore'
import { formatPrice, rentalChargeFromBase, securityDeposit, dailyRentalRate, productUrl } from '@/utils/helpers'
import { getProductDetail, getProductById } from '@/utils/api'

const BASE_RENTAL_DAYS = 3

export default function Compare() {
  const { comparisonItems, removeFromComparison, clearComparison, comparisonDays, setComparisonDays, addToComparison, updateComparisonItem } = useComparisonStore()
  const showToast = useStore((s) => s.showToast)

  const [rentalDays, setRentalDays] = useState(comparisonDays)
  const [isRefreshing, setIsRefreshing] = useState(false)
  // Track active image index for each product
  const [activeImageIndices, setActiveImageIndices] = useState(
    comparisonItems.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  )

  // Auto-refresh products that don't have full details loaded yet
  useEffect(() => {
    const refreshProductsWithSingleImage = async () => {
      const productsNeedingRefresh = comparisonItems.filter(
        p => !p.isFullDetails
      )
      
      if (productsNeedingRefresh.length === 0) return
      
      setIsRefreshing(true)
      
      for (const product of productsNeedingRefresh) {
        try {
          // If type is available, use it directly. Otherwise use getProductById which discovers the type.
          const fullProduct = product.type
            ? await getProductDetail({ id: product.id, type: product.type })
            : await getProductById({ id: product.id, name: product.name })

          if (fullProduct) {
            updateComparisonItem(fullProduct)
          }
        } catch (error) {
          console.warn(`Could not refresh product ${product.id}:`, error)
        }
      }
      
      setIsRefreshing(false)
    }
    
    refreshProductsWithSingleImage()
  }, []) // Run once on mount

  const handleDaysChange = (days) => {
    const clampedDays = Math.max(3, Math.min(7, days))
    setRentalDays(clampedDays)
    setComparisonDays(clampedDays)
  }

  const handleImageChange = (productId, direction) => {
    setActiveImageIndices(prev => {
      const product = comparisonItems.find(p => p.id === productId)
      if (!product || !product.images || product.images.length <= 1) return prev
      
      const currentIndex = prev[productId] || 0
      const maxIndex = product.images.length - 1
      let newIndex
      
      if (direction === 'next') {
        newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
      } else {
        newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
      }
      
      return { ...prev, [productId]: newIndex }
    })
  }

  const handleSelectDates = (product) => {
    // Redirect to product detail page to select rental dates
    showToast('Please select your rental dates on the product page', { type: 'info', duration: 3000 })
  }

  // Empty state
  if (comparisonItems.length === 0) {
    return (
      <>
        <SEO title="Compare Products" description="Compare up to 4 products side by side" />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--color-obsidian)' }}
        >
          <div className="text-center max-w-md px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'var(--color-gold-muted)',
                color: 'var(--color-gold)',
              }}
            >
              <GitCompare size={32} />
            </div>
            <h1
              className="text-2xl mb-3"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-ivory)',
                fontWeight: 500,
              }}
            >
              No Products to Compare
            </h1>
            <p
              className="text-sm mb-8"
              style={{
                color: 'var(--color-ivory-muted)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.6,
              }}
            >
              Add products from the shop or product detail pages to compare them side by side.
              You can compare up to {MAX_COMPARISON_ITEMS} products at once.
            </p>
            <Link to="/shop">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO 
        title={`Compare ${comparisonItems.length} Products`}
        description="Compare product features, prices, and rental options side by side"
      />

      {/* Header */}
      <section
        className="pt-24 lg:pt-28 pb-6"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/shop"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  color: 'var(--color-ivory-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-gold)'
                  e.currentTarget.style.color = 'var(--color-gold)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)'
                  e.currentTarget.style.color = 'var(--color-ivory-muted)'
                }}
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <p
                  className="text-[11px] tracking-[0.25em] uppercase mb-1"
                  style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                >
                  Product Comparison
                </p>
                <h1
                  className="text-2xl"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-ivory)',
                    fontWeight: 500,
                  }}
                >
                  Compare {comparisonItems.length} {comparisonItems.length === 1 ? 'Product' : 'Products'}
                </h1>
              </div>
            </div>

            <button
              onClick={clearComparison}
              className="h-10 px-4 rounded-full text-xs tracking-[0.08em] uppercase transition-colors duration-200"
              style={{
                background: 'transparent',
                border: '1px solid rgba(201, 169, 110, 0.2)',
                color: 'var(--color-ivory-muted)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-maroon)'
                e.currentTarget.style.color = 'var(--color-maroon)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)'
                e.currentTarget.style.color = 'var(--color-ivory-muted)'
              }}
            >
              Clear All
            </button>
          </div>

          {/* Rental Days Selector */}
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              background: 'rgba(201, 169, 110, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.1)',
            }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Calendar size={18} style={{ color: 'var(--color-gold)' }} />
                <span
                  className="text-sm"
                  style={{
                    color: 'var(--color-ivory)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Rental Duration
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDaysChange(rentalDays - 1)}
                  disabled={rentalDays <= 3}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-ivory)',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                  }}
                >
                  −
                </button>
                <div
                  className="px-6 py-2 rounded-full text-center min-w-[100px]"
                  style={{
                    background: 'var(--color-gold)',
                    color: 'var(--color-obsidian)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                  }}
                >
                  {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                </div>
                <button
                  onClick={() => handleDaysChange(rentalDays + 1)}
                  disabled={rentalDays >= 7}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-ivory)',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section
        className="pb-20"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Product Cards Row */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${comparisonItems.length}, 1fr)` }}>
                {comparisonItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Remove Button - Outside the link */}
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200"
                      style={{
                        background: 'rgba(10, 10, 10, 0.8)',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        color: 'var(--color-ivory)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-maroon)'
                        e.currentTarget.style.borderColor = 'var(--color-maroon)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)'
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)'
                      }}
                    >
                      <X size={14} />
                    </button>

                    <Link
                      to={productUrl(product)}
                      className="block rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                      style={{
                        background: 'var(--color-charcoal)',
                        border: '1px solid rgba(201, 169, 110, 0.1)',
                      }}
                    >
                      {/* Product Image Slider */}
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <ProductImage
                          src={product.images?.[activeImageIndices[product.id] || 0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p
                          className="text-[10px] tracking-[0.2em] uppercase mb-2"
                          style={{
                            color: 'var(--color-gold)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {product.code || `SKU-${product.id}`}
                        </p>
                        <h3
                          className="text-base mb-3 line-clamp-2"
                          style={{
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-ivory)',
                            fontWeight: 500,
                            minHeight: '3rem',
                          }}
                        >
                          {product.name}
                        </h3>

                        {/* Select Dates Button */}
                        <div
                          className="w-full h-10 rounded-full flex items-center justify-center gap-2 text-xs tracking-[0.08em] uppercase transition-all duration-200"
                          style={{
                            background: 'var(--color-gold)',
                            color: 'var(--color-obsidian)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          <Calendar size={14} />
                          Select Dates
                        </div>
                      </div>
                    </Link>

                    {/* Image Navigation Controls - Outside Link, positioned absolutely */}
                    {product.images && product.images.length >= 1 && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
                        <div className="aspect-[4/5] relative">
                          {/* Debug Badge - Show image count */}
                          <div
                            className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg pointer-events-none"
                            style={{
                              background: 'rgba(10, 10, 10, 0.85)',
                              color: 'var(--color-gold)',
                              fontFamily: 'var(--font-sans)',
                              border: '1px solid rgba(201, 169, 110, 0.3)',
                            }}
                          >
                            {(activeImageIndices[product.id] || 0) + 1} / {product.images?.length || 1}
                          </div>

                          {/* Show arrows if more than 1 image */}
                          {product.images.length > 1 && (
                            <>
                              {/* Previous Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleImageChange(product.id, 'prev')
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg pointer-events-auto"
                                style={{
                                  background: 'rgba(10, 10, 10, 0.9)',
                                  border: '2px solid rgba(201, 169, 110, 0.5)',
                                  color: 'var(--color-ivory)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--color-gold)'
                                  e.currentTarget.style.color = 'var(--color-obsidian)'
                                  e.currentTarget.style.borderColor = 'var(--color-gold)'
                                  e.currentTarget.style.transform = 'scale(1.1) translateY(-50%)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(10, 10, 10, 0.9)'
                                  e.currentTarget.style.color = 'var(--color-ivory)'
                                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.5)'
                                  e.currentTarget.style.transform = 'scale(1) translateY(-50%)'
                                }}
                                aria-label="Previous image"
                              >
                                <ChevronLeft size={20} strokeWidth={2.5} />
                              </button>

                              {/* Next Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleImageChange(product.id, 'next')
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-lg pointer-events-auto"
                                style={{
                                  background: 'rgba(10, 10, 10, 0.9)',
                                  border: '2px solid rgba(201, 169, 110, 0.5)',
                                  color: 'var(--color-ivory)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--color-gold)'
                                  e.currentTarget.style.color = 'var(--color-obsidian)'
                                  e.currentTarget.style.borderColor = 'var(--color-gold)'
                                  e.currentTarget.style.transform = 'scale(1.1) translateY(-50%)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(10, 10, 10, 0.9)'
                                  e.currentTarget.style.color = 'var(--color-ivory)'
                                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.5)'
                                  e.currentTarget.style.transform = 'scale(1) translateY(-50%)'
                                }}
                                aria-label="Next image"
                              >
                                <ChevronRight size={20} strokeWidth={2.5} />
                              </button>

                              {/* Image Dots Indicator */}
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {product.images.map((_, imgIndex) => (
                                  <button
                                    key={imgIndex}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setActiveImageIndices(prev => ({ ...prev, [product.id]: imgIndex }))
                                    }}
                                    className="w-2 h-2 rounded-full transition-all duration-200 pointer-events-auto"
                                    style={{
                                      background: (activeImageIndices[product.id] || 0) === imgIndex 
                                        ? 'var(--color-gold)' 
                                        : 'rgba(245, 240, 232, 0.5)',
                                      transform: (activeImageIndices[product.id] || 0) === imgIndex 
                                        ? 'scale(1.4)' 
                                        : 'scale(1)',
                                      boxShadow: (activeImageIndices[product.id] || 0) === imgIndex 
                                        ? '0 0 8px rgba(201, 169, 110, 0.6)' 
                                        : 'none',
                                    }}
                                    aria-label={`View image ${imgIndex + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {product.images.length > 1 && (
                          <div 
                            className="px-3 py-3 flex gap-2 overflow-x-auto scrollbar-hide pointer-events-auto"
                            style={{
                              background: 'rgba(201, 169, 110, 0.05)',
                              borderTop: '1px solid rgba(201, 169, 110, 0.1)',
                            }}
                          >
                            {product.images.map((image, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setActiveImageIndices(prev => ({ ...prev, [product.id]: imgIndex }))
                                }}
                                className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200"
                                style={{
                                  border: (activeImageIndices[product.id] || 0) === imgIndex 
                                    ? '3px solid var(--color-gold)' 
                                    : '2px solid rgba(201, 169, 110, 0.2)',
                                  opacity: (activeImageIndices[product.id] || 0) === imgIndex ? 1 : 0.6,
                                  boxShadow: (activeImageIndices[product.id] || 0) === imgIndex 
                                    ? '0 0 12px rgba(201, 169, 110, 0.4)' 
                                    : 'none',
                                }}
                                onMouseEnter={(e) => {
                                  if ((activeImageIndices[product.id] || 0) !== imgIndex) {
                                    e.currentTarget.style.opacity = '0.9'
                                    e.currentTarget.style.borderColor = 'var(--color-gold)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if ((activeImageIndices[product.id] || 0) !== imgIndex) {
                                    e.currentTarget.style.opacity = '0.6'
                                    e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)'
                                  }
                                }}
                                aria-label={`View image ${imgIndex + 1}`}
                              >
                                <ProductImage
                                  src={image}
                                  alt={`${product.name} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Comparison Table */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'var(--color-charcoal)',
                  border: '1px solid rgba(201, 169, 110, 0.1)',
                }}
              >
                {/* SKU Row */}
                <ComparisonRow
                  label="SKU"
                  values={comparisonItems.map(p => p.code || `SKU-${p.id}`)}
                />

                {/* Name Row */}
                <ComparisonRow
                  label="Product Name"
                  values={comparisonItems.map(p => p.name)}
                />

                {/* Description Row */}
                <ComparisonRow
                  label="Description"
                  values={comparisonItems.map(p => p.description || 'No description available')}
                  multiline
                />

                {/* Rental Price Row */}
                <ComparisonRow
                  label={`Rental (${rentalDays} days)`}
                  values={comparisonItems.map(p => {
                    const baseRentPrice = p.rentPrice ?? dailyRentalRate(p.mrp ?? p.price) * BASE_RENTAL_DAYS
                    const rentTotal = rentalChargeFromBase(baseRentPrice, rentalDays)
                    return formatPrice(rentTotal)
                  })}
                  highlight
                />

                {/* Deposit Row */}
                <ComparisonRow
                  label="Security Deposit"
                  values={comparisonItems.map(p => {
                    const deposit = p.deposit ?? securityDeposit(p.mrp ?? p.price)
                    return formatPrice(deposit)
                  })}
                />

                {/* Total Row */}
                <ComparisonRow
                  label={`Total (${rentalDays} days)`}
                  values={comparisonItems.map(p => {
                    const baseRentPrice = p.rentPrice ?? dailyRentalRate(p.mrp ?? p.price) * BASE_RENTAL_DAYS
                    const rentTotal = rentalChargeFromBase(baseRentPrice, rentalDays)
                    const deposit = p.deposit ?? securityDeposit(p.mrp ?? p.price)
                    return formatPrice(rentTotal + deposit)
                  })}
                  highlight
                  bold
                />

                {/* Purchase Price Row */}
                <ComparisonRow
                  label="Purchase Price"
                  values={comparisonItems.map(p => {
                    const price = p.salePrice ?? p.mrp ?? p.price
                    return price ? formatPrice(price) : 'Not available'
                  })}
                />

                {/* Stock Status Row */}
                <ComparisonRow
                  label="Availability"
                  values={comparisonItems.map(p => {
                    if (p.inventory > 5) return 'In Stock'
                    if (p.inventory > 0) return 'Limited Stock'
                    return 'Out of Stock'
                  })}
                />

                {/* Category Row */}
                <ComparisonRow
                  label="Category"
                  values={comparisonItems.map(p => p.category || (p.type === 'garments' ? 'Bridal Wear' : 'Jewellery'))}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * ComparisonRow Component
 * Single row in the comparison table
 */
function ComparisonRow({ label, values, highlight = false, bold = false, multiline = false }) {
  return (
    <div
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: `200px repeat(${values.length}, 1fr)`,
        borderBottom: '1px solid rgba(201, 169, 110, 0.1)',
        background: highlight ? 'rgba(201, 169, 110, 0.05)' : 'transparent',
      }}
    >
      {/* Label */}
      <div className="flex items-center">
        <span
          className="text-xs tracking-[0.08em] uppercase"
          style={{
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-sans)',
            fontWeight: bold ? 600 : 400,
          }}
        >
          {label}
        </span>
      </div>

      {/* Values */}
      {values.map((value, index) => (
        <div key={index} className="flex items-center">
          <span
            className={`text-sm ${multiline ? '' : 'truncate'}`}
            style={{
              color: 'var(--color-ivory)',
              fontFamily: 'var(--font-sans)',
              fontWeight: bold ? 600 : 400,
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
