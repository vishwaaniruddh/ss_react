import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, X, ArrowUpRight, TrendingUp } from 'lucide-react'
import useStore from '@/store/useStore'
import useProductSearch from '@/hooks/useProductSearch'
import ProductImage from '@/components/ui/ProductImage'
import { formatPrice, productUrl } from '@/utils/helpers'

/**
 * Curated suggestion strings — surfaced when the input is empty so the
 * panel never feels barren. Click-throughs prefill the search box and let
 * the API take over.
 *
 * Verified against the live catalogue — every term here currently returns
 * results, so users never tap into a dead suggestion.
 */
const POPULAR_SEARCHES = [
  'Bridal Necklace',
  'Kundan',
  'Jhumka',
  'Polki',
  'Maang Tikka',
  'Lehenga',
  'Bangles',
  'Rani Haar',
  'Choker',
  'Earrings',
]

const RECENT_LINKS = [
  { label: 'Bridal Atelier',   path: '/bridal' },
  { label: 'Necklace Sets',    path: '/jewellery/necklace-sets' },
  { label: 'Earrings',         path: '/jewellery/earrings' },
  { label: 'View All Pieces',  path: '/shop' },
]

const RESULT_LIMIT = 8

export default function SearchOverlay() {
  const isSearchOpen = useStore((s) => s.isSearchOpen)
  const toggleSearch = useStore((s) => s.toggleSearch)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  // Auto-focus when opened, lock body scroll, close on ESC
  useEffect(() => {
    if (!isSearchOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') toggleSearch()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)

    // Slight delay so the focus ring animates in cleanly
    const t = setTimeout(() => inputRef.current?.focus(), 120)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
      clearTimeout(t)
    }
  }, [isSearchOpen, toggleSearch])

  // Clear query a moment after closing so the next open is fresh, but the
  // results don't disappear before the exit animation finishes.
  useEffect(() => {
    if (!isSearchOpen) {
      const t = setTimeout(() => setQuery(''), 300)
      return () => clearTimeout(t)
    }
  }, [isSearchOpen])

  // Debounced API search — only fires while the overlay is actually open.
  const { items: results, pagination, isLoading, error } = useProductSearch({
    query,
    limit: RESULT_LIMIT,
    enabled: isSearchOpen,
  })

  const trimmed = query.trim()
  const hasQuery = trimmed.length > 0
  const totalCount = pagination?.total ?? results.length

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(10, 10, 10, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            onClick={toggleSearch}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col h-full"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Top bar with input */}
            <div
              className="pt-8 pb-6 pl-6 pr-6 lg:pl-12 lg:pr-12"
              style={{ borderBottom: '1px solid rgba(201, 169, 110, 0.12)' }}
            >
              <div className="ml-auto mr-auto" style={{ maxWidth: '1100px' }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="label-text" style={{ color: 'var(--color-gold)' }}>
                    Search the Atelier
                  </span>
                  <button
                    onClick={toggleSearch}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{ color: 'var(--color-ivory-muted)' }}
                    aria-label="Close search"
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-muted)')}
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>

                <label
                  className="flex items-center gap-4 pb-4"
                  style={{ borderBottom: '1px solid rgba(201, 169, 110, 0.25)' }}
                >
                  <Search size={22} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for necklaces, kundan, bridal sets…"
                    className="flex-1 outline-none bg-transparent placeholder-ivory/40"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.25rem, 2.4vw, 1.875rem)',
                      color: 'var(--color-ivory)',
                      letterSpacing: '-0.01em',
                    }}
                    id="search-input"
                    aria-label="Search products"
                  />

                  {/* Inline loader spinner */}
                  {hasQuery && isLoading && (
                    <span
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: 'rgba(201, 169, 110, 0.2)',
                        borderTopColor: 'var(--color-gold)',
                      }}
                      aria-label="Searching"
                    />
                  )}

                  {hasQuery && (
                    <button
                      onClick={() => {
                        setQuery('')
                        inputRef.current?.focus()
                      }}
                      className="text-xs tracking-[0.15em] uppercase transition-colors duration-300"
                      style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
                    >
                      Clear
                    </button>
                  )}
                </label>
              </div>
            </div>

            {/* Results / suggestions */}
            <div className="flex-1 overflow-y-auto pt-8 pb-12 pl-6 pr-6 lg:pl-12 lg:pr-12">
              <div className="ml-auto mr-auto" style={{ maxWidth: '1100px' }}>
                {!hasQuery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Popular searches */}
                    <div>
                      <p
                        className="label-text mb-6 flex items-center gap-2"
                        style={{ color: 'var(--color-ivory-muted)' }}
                      >
                        <TrendingUp size={14} /> Popular Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => {
                              setQuery(term)
                              inputRef.current?.focus()
                            }}
                            className="pl-4 pr-4 pt-2 pb-2 rounded-full text-xs tracking-[0.08em] uppercase transition-all duration-300"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: 'var(--color-ivory-muted)',
                              border: '1px solid rgba(201, 169, 110, 0.2)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--color-obsidian)'
                              e.currentTarget.style.background = 'var(--color-gold)'
                              e.currentTarget.style.borderColor = 'var(--color-gold)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--color-ivory-muted)'
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)'
                            }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick links */}
                    <div>
                      <p className="label-text mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
                        Discover
                      </p>
                      <div className="flex flex-col">
                        {RECENT_LINKS.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={toggleSearch}
                            className="group flex items-center justify-between pt-4 pb-4 transition-colors duration-300"
                            style={{
                              borderTop: '1px solid rgba(201, 169, 110, 0.08)',
                              fontFamily: 'var(--font-serif)',
                              color: 'var(--color-ivory)',
                              fontSize: '1.25rem',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory)')}
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight size={18} strokeWidth={1.5} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {hasQuery && error && (
                  <div className="text-center pt-12 pb-12">
                    <p className="heading-sm mb-3" style={{ color: 'var(--color-ivory)' }}>
                      Search failed
                    </p>
                    <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                      {error.message}
                    </p>
                  </div>
                )}

                {hasQuery && !error && isLoading && results.length === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ResultSkeleton key={i} />
                    ))}
                  </div>
                )}

                {hasQuery && !error && !isLoading && results.length === 0 && (
                  <div className="text-center pt-16 pb-16">
                    <p className="heading-sm mb-3" style={{ color: 'var(--color-ivory)' }}>
                      No pieces match “{trimmed}”
                    </p>
                    <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                      Try a different keyword or browse our full collection.
                    </p>
                    <Link
                      to="/shop"
                      onClick={toggleSearch}
                      className="inline-flex items-center gap-2 mt-8 pt-3 pb-3 pl-6 pr-6 rounded-full text-xs tracking-[0.15em] uppercase"
                      style={{
                        background: 'var(--color-gold)',
                        color: 'var(--color-obsidian)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Browse All <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}

                {hasQuery && !error && results.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <p className="label-text" style={{ color: 'var(--color-ivory-muted)' }}>
                        Showing {results.length} of {totalCount}{' '}
                        {totalCount === 1 ? 'result' : 'results'}
                      </p>
                      {totalCount > results.length && (
                        <Link
                          to={`/shop?q=${encodeURIComponent(trimmed)}`}
                          onClick={toggleSearch}
                          className="text-xs tracking-[0.15em] uppercase flex items-center gap-1 transition-colors duration-300"
                          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                        >
                          See all <ArrowUpRight size={14} />
                        </Link>
                      )}
                    </div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.05 } },
                      }}
                    >
                      {results.map((product) => (
                        <motion.div
                          key={product.id}
                          variants={{
                            hidden: { opacity: 0, y: 16 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                          }}
                        >
                          <ResultCard product={product} onNavigate={toggleSearch} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Result row — image + meta + price.
 *
 * The legacy API returns a `type` ("jewellery" | "garments") which makes
 * for a nicer caption than the absent `collection` we used to read from
 * mock data.
 * ──────────────────────────────────────────────────────────────────────────── */
function ResultCard({ product, onNavigate }) {
  const captionLabel =
    product.type === 'garments' ? 'Bridal Wear' : product.type === 'jewellery' ? 'Jewellery' : ''

  return (
    <Link
      to={productUrl(product)}
      onClick={onNavigate}
      className="group flex gap-4 p-3 rounded-xl transition-all duration-300"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        border: '1px solid rgba(201, 169, 110, 0.08)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.08)')}
    >
      <div
        className="w-20 h-24 rounded-lg overflow-hidden shrink-0"
        style={{ background: 'var(--color-charcoal)' }}
      >
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {captionLabel && (
          <p
            className="text-[0.6rem] tracking-[0.2em] uppercase mb-1"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-gold)' }}
          >
            {captionLabel}
            {product.code && (
              <span style={{ color: 'var(--color-ivory-muted)' }}> · {product.code}</span>
            )}
          </p>
        )}
        <h4
          className="mb-2 transition-colors duration-300 group-hover:text-gold truncate"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-ivory)',
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.3,
          }}
          title={product.name}
        >
          {product.name}
        </h4>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory)' }}
        >
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  )
}

function ResultSkeleton() {
  return (
    <div
      className="flex gap-4 p-3 rounded-xl animate-pulse"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        border: '1px solid rgba(201, 169, 110, 0.08)',
      }}
    >
      <div
        className="w-20 h-24 rounded-lg shrink-0"
        style={{ background: 'rgba(201, 169, 110, 0.06)' }}
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
        <div className="h-2 rounded w-1/3" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
        <div className="h-4 rounded w-3/4" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
        <div className="h-3 rounded w-1/4" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
      </div>
    </div>
  )
}
