import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'
import ProductCard from '@/components/ui/ProductCard'
import InfiniteScrollSentinel from '@/components/ui/InfiniteScrollSentinel'
import SEO from '@/seo/SEO'
import { PRODUCT_SORT_OPTIONS } from '@/utils/api'
import { BRIDAL_CATEGORIES, JEWELLERY_CATEGORIES, buildCategoryQuery } from '@/utils/categories'
import useInfiniteProducts from '@/hooks/useInfiniteProducts'

/* ────────────────────────────────────────────────────────────────────────────
 * Filter chip data
 * ──────────────────────────────────────────────────────────────────────────── */
const ALL_CHIP = { key: 'all', label: 'All', query: null }

const FILTER_CHIPS = [
  ALL_CHIP,
  ...JEWELLERY_CATEGORIES.map((c) => ({
    key: `jewel-${c.slug}`,
    label: c.label,
    query: buildCategoryQuery(c),
  })),
  ...BRIDAL_CATEGORIES.map((c) => ({
    key: `bridal-${c.slug}`,
    label: c.label,
    query: buildCategoryQuery(c),
  })),
]

const PRICE_BOUNDS = { min: 0, max: 500000 }

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').trim()

  const [activeKey, setActiveKey] = useState('all')
  const [sort, setSort] = useState('sku_desc')

  const activeChip = useMemo(
    () => FILTER_CHIPS.find((c) => c.key === activeKey) || ALL_CHIP,
    [activeKey],
  )

  // When a search query is active, ignore the category filter so users can
  // search across the entire catalogue.
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    refetch,
    totalCount,
  } = useInfiniteProducts({
    category: searchQuery ? null : activeChip.query,
    search: searchQuery || null,
    minPrice: PRICE_BOUNDS.min,
    maxPrice: PRICE_BOUNDS.max,
    sort,
  })

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <>
      <SEO
        title="Shop"
        description="Explore our curated collection of handcrafted Indian jewellery and bridal apparels."
      />

      {/* Search-active banner */}
      {searchQuery && (
        <section
          className="pt-24 lg:pt-28 pb-3"
          style={{ background: 'var(--color-obsidian)' }}
        >
          <div className="container-luxury flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <span className="label-text" style={{ color: 'var(--color-ivory-muted)' }}>
                Searching
              </span>
              <span
                className="pl-3 pr-2 pt-1 pb-1 rounded-full flex items-center gap-2 text-sm"
                style={{
                  background: 'rgba(201, 169, 110, 0.1)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                “{searchQuery}”
                <button
                  type="button"
                  onClick={clearSearch}
                  className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
                  style={{ color: 'var(--color-ivory-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-muted)')}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Header strip — title + sort sit on a compact bar so products are
       * immediately in view. No hero image on listing pages. */}
      <section
        className={`${searchQuery ? 'pt-3' : 'pt-24 lg:pt-28'} pb-4`}
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p
              className="text-[11px] tracking-[0.25em] uppercase mb-1"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
            >
              Our Collection
            </p>
            <h1
              className="text-2xl"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-ivory)',
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              The Shop
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm" style={{ color: 'var(--color-ivory-muted)' }}>
              {isLoading ? 'Loading…' : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'}`}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs tracking-[0.08em] uppercase pl-3 pr-8 pt-2 pb-2 rounded-full cursor-pointer"
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: 'var(--color-ivory-muted)',
                border: '1px solid rgba(201, 169, 110, 0.2)',
                appearance: 'none',
              }}
              aria-label="Sort products"
            >
              {PRODUCT_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: 'var(--color-charcoal)' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section
        className="pt-3 pb-3"
        style={{
          background: 'var(--color-obsidian)',
          borderTop: '1px solid rgba(201, 169, 110, 0.08)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.08)',
        }}
      >
        <div className="container-luxury">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_CHIPS.map((chip) => {
              const active = activeKey === chip.key
              return (
                <button
                  key={chip.key}
                  onClick={() => setActiveKey(chip.key)}
                  className="pl-4 pr-4 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: active ? 'var(--color-gold)' : 'transparent',
                    color: active ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                    border: `1px solid ${active ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.15)'}`,
                  }}
                  id={`filter-${chip.key}`}
                  aria-pressed={active}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="pt-6 pb-24" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          {error && !isLoading && (
            <div className="text-center pt-20 pb-20">
              <p className="heading-sm mb-3" style={{ color: 'var(--color-ivory)' }}>
                Couldn't load products
              </p>
              <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
                {error.message}
              </p>
              <button
                onClick={refetch}
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
          )}

          {!error && isLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              aria-busy="true"
              aria-live="polite"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !isLoading && items.length > 0 && (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                key={`${activeKey}-${sort}-${searchQuery}`}
              >
                {items.map((product, i) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Skeleton tail while appending pages */}
              {isLoadingMore && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
                  aria-busy="true"
                  aria-live="polite"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductSkeleton key={`more-${i}`} />
                  ))}
                </div>
              )}

              {/* End-of-list marker */}
              {!hasMore && !isLoadingMore && (
                <p
                  className="text-center mt-12 text-[11px] tracking-[0.25em] uppercase"
                  style={{ color: 'rgba(245, 240, 232, 0.4)' }}
                >
                  ✦ End of Collection ✦
                </p>
              )}

              <InfiniteScrollSentinel
                onIntersect={loadMore}
                disabled={!hasMore || isLoadingMore || isLoading || Boolean(error)}
              />
            </>
          )}

          {!error && !isLoading && items.length === 0 && (
            <div className="text-center pt-20 pb-20">
              <p className="heading-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                No pieces found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Skeleton card — matches ProductCard's aspect ratio so the grid doesn't
 * shift when real content swaps in.
 * ──────────────────────────────────────────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="aspect-[4/5] rounded-xl mb-4"
        style={{ background: 'rgba(201, 169, 110, 0.06)' }}
      />
      <div
        className="h-3 rounded w-1/3 mb-2"
        style={{ background: 'rgba(201, 169, 110, 0.08)' }}
      />
      <div
        className="h-4 rounded w-3/4 mb-2"
        style={{ background: 'rgba(201, 169, 110, 0.08)' }}
      />
      <div
        className="h-4 rounded w-1/4"
        style={{ background: 'rgba(201, 169, 110, 0.08)' }}
      />
    </div>
  )
}
