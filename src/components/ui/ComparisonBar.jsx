import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import useComparisonStore, { MAX_COMPARISON_ITEMS } from '@/store/useComparisonStore'
import ProductImage from '@/components/ui/ProductImage'

/**
 * ComparisonBar
 * ───────────────────────────────────────────────────────────────────────────
 * Floating bar at the bottom of the screen showing selected comparison items.
 * Only visible when there are items in comparison.
 */
export default function ComparisonBar() {
  const { 
    comparisonItems, 
    removeFromComparison, 
    clearComparison, 
    comparisonCollapsed, 
    setComparisonCollapsed 
  } = useComparisonStore()

  if (comparisonItems.length === 0) return null

  if (comparisonCollapsed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 pointer-events-auto"
        >
          <button
            onClick={() => setComparisonCollapsed(false)}
            className="h-12 px-5 rounded-full flex items-center gap-3 shadow-2xl transition-all duration-300 bg-[var(--color-obsidian)] text-[var(--color-gold)] border-2 border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-obsidian)] font-semibold tracking-wider text-xs uppercase cursor-pointer"
            style={{
              boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <GitCompare size={18} />
            <span>Compare</span>
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--color-gold)] text-[var(--color-obsidian)] border border-[var(--color-obsidian)]"
            >
              {comparisonItems.length}
            </span>
          </button>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 pb-4 px-4"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="container-luxury"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="rounded-2xl p-4 backdrop-blur-xl shadow-2xl"
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              border: '1px solid rgba(201, 169, 110, 0.2)',
            }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Title + Count */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-gold-muted)',
                    color: 'var(--color-gold)',
                  }}
                >
                  <GitCompare size={18} />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: 'var(--color-ivory)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Compare Products
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: 'var(--color-ivory-muted)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {comparisonItems.length} of {MAX_COMPARISON_ITEMS} selected
                  </p>
                </div>
              </div>

              {/* Center: Product Thumbnails */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                {comparisonItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="relative group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden"
                      style={{
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                      }}
                    >
                      <ProductImage
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background: 'var(--color-maroon)',
                        color: 'var(--color-ivory)',
                      }}
                      aria-label={`Remove ${product.name}`}
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: MAX_COMPARISON_ITEMS - comparisonItems.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      border: '1px dashed rgba(201, 169, 110, 0.2)',
                      background: 'rgba(201, 169, 110, 0.05)',
                    }}
                  >
                    <GitCompare size={16} style={{ color: 'rgba(201, 169, 110, 0.3)' }} />
                  </div>
                ))}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setComparisonCollapsed(true)}
                  className="h-10 px-4 rounded-full text-xs tracking-[0.08em] uppercase transition-colors duration-200 cursor-pointer"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                    color: 'var(--color-ivory-muted)',
                    fontFamily: 'var(--font-sans)',
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
                  Hide
                </button>
                <button
                  onClick={clearComparison}
                  className="h-10 px-4 rounded-full text-xs tracking-[0.08em] uppercase transition-colors duration-200 cursor-pointer"
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
                  Clear
                </button>
                <Link
                  to="/compare"
                  className="h-10 px-6 rounded-full text-xs tracking-[0.08em] uppercase flex items-center gap-2 transition-all duration-200"
                  style={{
                    background: 'var(--color-gold)',
                    color: 'var(--color-obsidian)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  Compare Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
