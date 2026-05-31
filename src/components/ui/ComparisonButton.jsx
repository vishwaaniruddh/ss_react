import { motion } from 'framer-motion'
import { GitCompare, Check } from 'lucide-react'
import useComparisonStore, { MAX_COMPARISON_ITEMS } from '@/store/useComparisonStore'
import useStore from '@/store/useStore'
import { getProductDetail, getProductById } from '@/utils/api'

/**
 * ComparisonButton
 * ───────────────────────────────────────────────────────────────────────────
 * Button to add/remove products from comparison.
 * Can be used in ProductCard or ProductDetails.
 * 
 * When adding from ProductCard (which only has 1 image), fetches full product
 * details to get all images for the comparison view.
 * 
 * @param {object} product - Product to compare
 * @param {string} variant - 'icon' | 'button' (default: 'icon')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function ComparisonButton({ 
  product, 
  variant = 'icon',
  size = 'md',
  className = '' 
}) {
  const { 
    addToComparison, 
    removeFromComparison, 
    isInComparison,
    isComparisonFull 
  } = useComparisonStore()
  
  const showToast = useStore((s) => s.showToast)
  
  const inComparison = isInComparison(product.id)
  const isFull = isComparisonFull()

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeFromComparison(product.id)
      showToast('Removed from comparison', { type: 'info' })
    } else {
      if (isFull) {
        showToast(`Maximum ${MAX_COMPARISON_ITEMS} products can be compared`, { type: 'error' })
        return
      }
      
      // If product does not have full details, fetch full details to get all images and details
      let productToAdd = product
      if (!product.isFullDetails) {
        try {
          const fullProduct = product.type
            ? await getProductDetail({ id: product.id, type: product.type })
            : await getProductById({ id: product.id, name: product.name })

          if (fullProduct) {
            productToAdd = fullProduct
          }
        } catch (error) {
          console.warn('Could not fetch full product details:', error)
          // Continue with original product if fetch fails
        }
      }
      
      const added = addToComparison(productToAdd)
      if (added) {
        showToast('Added to comparison', { type: 'success' })
      }
    }
  }

  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  }

  // Icon variant (for ProductCard)
  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleClick}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${className}`}
        style={{
          background: inComparison 
            ? 'var(--color-gold)' 
            : 'rgba(10, 10, 10, 0.6)',
          border: inComparison 
            ? '1px solid var(--color-gold)' 
            : '1px solid rgba(201, 169, 110, 0.3)',
          color: inComparison 
            ? 'var(--color-obsidian)' 
            : 'var(--color-ivory)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        disabled={!inComparison && isFull}
      >
        {inComparison ? (
          <Check size={iconSizes[size]} strokeWidth={2.5} />
        ) : (
          <GitCompare size={iconSizes[size]} />
        )}
      </motion.button>
    )
  }

  // Button variant (for ProductDetails)
  return (
    <motion.button
      onClick={handleClick}
      className={`h-12 px-6 rounded-full flex items-center justify-center gap-2 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-300 ${className}`}
      style={{
        background: inComparison 
          ? 'var(--color-gold)' 
          : 'transparent',
        border: '1px solid var(--color-gold)',
        color: inComparison 
          ? 'var(--color-obsidian)' 
          : 'var(--color-gold)',
        fontFamily: 'var(--font-sans)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={!inComparison && isFull}
    >
      {inComparison ? (
        <>
          <Check size={16} strokeWidth={2.5} />
          In Comparison
        </>
      ) : (
        <>
          <GitCompare size={16} />
          Compare
        </>
      )}
    </motion.button>
  )
}
