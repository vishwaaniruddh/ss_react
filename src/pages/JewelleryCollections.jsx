import { useMemo, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight as ChevronCrumb } from 'lucide-react'
import SEO from '@/seo/SEO'
import ProductCard from '@/components/ui/ProductCard'
import InfiniteScrollSentinel from '@/components/ui/InfiniteScrollSentinel'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { PRODUCT_SORT_OPTIONS } from '@/utils/api'
import {
  JEWELLERY_CATEGORIES,
  buildCategoryQuery,
  findCategoryBySlugPath,
  categoryRoute,
} from '@/utils/categories'
import useInfiniteProducts from '@/hooks/useInfiniteProducts'

/* ────────────────────────────────────────────────────────────────────────────
 * Resolve the active category from the URL.
 *
 * Routes handled:
 *   /jewellery                       → no node, "All Jewellery" view
 *   /jewellery/:slug                 → main category node
 *   /jewellery/:slug/:subSlug        → sub-category node (with .parent)
 * ──────────────────────────────────────────────────────────────────────────── */
function useResolvedCategory() {
  const { slug, subSlug } = useParams()
  return useMemo(() => {
    if (!slug) return { node: null, isAll: true }
    const path = subSlug ? `${slug}/${subSlug}` : slug
    const node = findCategoryBySlugPath(path)
    return { node, isAll: false, missing: !node }
  }, [slug, subSlug])
}

const PRICE_BOUNDS = { min: 0, max: 100000 }

export default function JewelleryCollections() {
  const { node, isAll, missing } = useResolvedCategory()
  const [sort, setSort] = useState('sku_desc')
  const [hiddenIds, setHiddenIds] = useState(new Set())

  const handleImageInvalid = useCallback((id) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const categoryQuery = node ? buildCategoryQuery(node) : null

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
    category: categoryQuery,
    type: 'jewellery',
    minPrice: PRICE_BOUNDS.min,
    maxPrice: PRICE_BOUNDS.max,
    sort,
    enabled: !missing,
  })

  const heading = node?.label || (isAll ? 'Jewellery That Transcends Time' : 'Collection Not Found')
  const seoTitle = node ? `${node.label} — Jewellery Collections` : 'Jewellery Collections'
  const seoDesc = node
    ? `Explore our ${node.label} collection — handcrafted heritage jewellery available for rent.`
    : 'Explore our heritage jewellery collections — from temple gold to kundan masterpieces.'

  // Breadcrumb trail. Sub-categories include the parent main as a hop.
  const crumbs = useMemo(() => {
    const trail = [
      { label: 'Home', to: '/' },
      { label: 'Jewellery', to: '/jewellery' },
    ]
    if (node?.parent) {
      trail.push({ label: node.parent.label, to: categoryRoute(node.parent) })
      trail.push({ label: node.label, to: categoryRoute(node) })
    } else if (node) {
      trail.push({ label: node.label, to: categoryRoute(node) })
    }
    return trail
  }, [node])

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} />

      {/* Compact title + sort bar (no hero image) */}
      <section
        className="pt-24 lg:pt-28 pb-4"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center flex-wrap gap-2 text-[11px] tracking-[0.08em] uppercase"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)' }}
          >
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1
              return (
                <span key={`${crumb.to}-${i}`} className="flex items-center gap-2">
                  {isLast ? (
                    <span style={{ color: 'var(--color-gold)' }} aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="transition-colors duration-300 hover:text-gold"
                      style={{ color: 'var(--color-ivory-muted)' }}
                    >
                      {crumb.label}
                    </Link>
                  )}
                  {!isLast && (
                    <ChevronCrumb size={11} style={{ color: 'rgba(245, 240, 232, 0.3)' }} />
                  )}
                </span>
              )
            })}
          </nav>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p
                className="text-[11px] tracking-[0.25em] uppercase mb-1"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
              >
                {node?.parent ? node.parent.label : 'Heritage Collections'}
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
                {heading}
              </h1>
            </div>

            {!missing && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                  {isLoading
                    ? 'Loading…'
                    : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'}`}
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
                    <option
                      key={opt.value}
                      value={opt.value}
                      style={{ background: 'var(--color-charcoal)' }}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sub-category rail */}
      <CategoryRail node={node} isAll={isAll} />

      {/* Products grid */}
      <section className="pt-6 pb-24" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          {missing && (
            <div className="text-center pt-20 pb-20">
              <p className="heading-sm mb-3" style={{ color: 'var(--color-ivory)' }}>
                That collection doesn't exist
              </p>
              <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
                Try one of our heritage categories below.
              </p>
              <Link
                to="/jewellery"
                className="pl-5 pr-5 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase"
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'var(--color-gold)',
                  color: 'var(--color-obsidian)',
                }}
              >
                View all jewellery
              </Link>
            </div>
          )}

          {!missing && error && !isLoading && (
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

          {!missing && !error && isLoading && (
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

          {!missing && !error && !isLoading && items.length > 0 && (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                key={`${node?.type}-${node?.id}-${sort}`}
              >
                {items.map((product, i) => (
                  <motion.div key={product.id} variants={staggerItem} style={{ display: hiddenIds.has(product.id) ? 'none' : undefined }}>
                    <ProductCard product={product} index={i} onImageInvalid={handleImageInvalid} />
                  </motion.div>
                ))}
              </motion.div>

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

          {!missing && !error && !isLoading && items.length === 0 && (
            <div className="text-center pt-20 pb-20">
              <p className="heading-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                No pieces available in this collection right now.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Category rail — horizontal scroller of related categories for quick jumps.
 * ──────────────────────────────────────────────────────────────────────────── */
function CategoryRail({ node, isAll }) {
  let chips = []

  if (isAll || !node) {
    // Top level: show the mains.
    chips = JEWELLERY_CATEGORIES.map((c) => ({
      label: c.label,
      to: categoryRoute(c),
      active: false,
    }))
  } else if (node.parent) {
    // Sub level: show siblings.
    chips = (node.parent.children || []).map((c) => ({
      label: c.label,
      to: categoryRoute({ ...c, parent: node.parent }),
      active: c.id === node.id && c.type === node.type,
    }))
  } else if (node.children?.length) {
    // Main with children: show its children plus an "All <Main>" pin.
    chips = [
      { label: `All ${node.label}`, to: categoryRoute(node), active: true },
      ...node.children.map((c) => ({
        label: c.label,
        to: categoryRoute({ ...c, parent: node }),
        active: false,
      })),
    ]
  } else {
    // Main without children: peer mains for lateral browsing.
    chips = JEWELLERY_CATEGORIES.map((c) => ({
      label: c.label,
      to: categoryRoute(c),
      active: c.id === node.id && c.type === node.type,
    }))
  }

  if (!chips.length) return null

  return (
    <section
      className="pt-4 pb-4"
      style={{
        background: 'var(--color-obsidian)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.08)',
      }}
    >
      <div className="container-luxury flex gap-2 overflow-x-auto scrollbar-hide">
        {chips.map((chip) => (
          <Link
            key={chip.to + chip.label}
            to={chip.to}
            className="pl-4 pr-4 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-300"
            style={{
              fontFamily: 'var(--font-sans)',
              background: chip.active ? 'var(--color-gold)' : 'transparent',
              color: chip.active ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
              border: `1px solid ${chip.active ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.15)'}`,
            }}
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProductSkeleton() {
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
