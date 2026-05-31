import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Comparison Store
 * ───────────────────────────────────────────────────────────────────────────
 * Manages product comparison state with a maximum of 4 products.
 * Persists selections across sessions.
 */

const MAX_COMPARISON_ITEMS = 4

const useComparisonStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────── State ────────────────────────────
      comparisonItems: [], // Array of products (max 4)
      comparisonDays: 3,   // Default rental duration for comparison
      comparisonCollapsed: false, // Collapse state for the floating bar

      // ─────────────────────── Actions ───────────────────────────
      
      /**
       * Add a product to comparison list
       * Returns true if added, false if already at max capacity
       */
      addToComparison: (product) => {
        const { comparisonItems } = get()
        
        // Check if already in comparison
        if (comparisonItems.some(item => item.id === product.id)) {
          return false
        }
        
        // Check max capacity
        if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
          return false
        }
        
        set({ comparisonItems: [...comparisonItems, product], comparisonCollapsed: false })
        return true
      },

      /**
       * Remove a product from comparison list
       */
      removeFromComparison: (productId) => {
        const { comparisonItems } = get()
        set({
          comparisonItems: comparisonItems.filter(item => item.id !== productId)
        })
      },

      /**
       * Update a product in comparison list (keeps order)
       */
      updateComparisonItem: (updatedProduct) => {
        const { comparisonItems } = get()
        set({
          comparisonItems: comparisonItems.map(item =>
            item.id === updatedProduct.id ? updatedProduct : item
          )
        })
      },

      /**
       * Clear all comparison items
       */
      clearComparison: () => {
        set({ comparisonItems: [], comparisonDays: 3, comparisonCollapsed: false })
      },

      /**
       * Set collapse state
       */
      setComparisonCollapsed: (collapsed) => {
        set({ comparisonCollapsed: collapsed })
      },

      /**
       * Check if a product is in comparison
       */
      isInComparison: (productId) => {
        return get().comparisonItems.some(item => item.id === productId)
      },

      /**
       * Get comparison count
       */
      getComparisonCount: () => {
        return get().comparisonItems.length
      },

      /**
       * Update rental days for comparison
       */
      setComparisonDays: (days) => {
        const clampedDays = Math.max(3, Math.min(7, days))
        set({ comparisonDays: clampedDays })
      },

      /**
       * Check if comparison is full
       */
      isComparisonFull: () => {
        return get().comparisonItems.length >= MAX_COMPARISON_ITEMS
      },
    }),
    {
      name: 'srishringarr-comparison',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        comparisonItems: state.comparisonItems,
        comparisonDays: state.comparisonDays,
        comparisonCollapsed: state.comparisonCollapsed,
      }),
    }
  )
)

export default useComparisonStore
export { MAX_COMPARISON_ITEMS }
