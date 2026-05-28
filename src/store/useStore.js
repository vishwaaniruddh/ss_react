import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Recompute cart count (sum of quantities) from a cart array.
 */
const computeCount = (cart) => cart.reduce((acc, i) => acc + i.quantity, 0)

const useStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────────── UI ────────────────────────────
      isMenuOpen: false,
      isLoading: false,
      isSearchOpen: false,
      quickViewProduct: null,
      toasts: [],

      // ──────────────────────── Cart / Wishlist ──────────────────
      cart: [],
      cartCount: 0,

      wishlist: [],
      wishlistCount: 0,

      // ─────────────────────── UI actions ────────────────────────
      toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
      setQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),

      // ────────────────────── Toast actions ──────────────────────
      showToast: (message, { type = 'info', duration = 4000 } = {}) => {
        const id = Date.now() + Math.random()
        set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
        return id
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // ─────────────────────── Coupon ────────────────────────
      coupon: null, // { code, discount, discountType, couponAmount }

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      // ─────────────────────── Cart actions ──────────────────────
      addToCart: (product, quantity = 1) => {
        const { cart } = get()
        const existing = cart.find((item) => item.id === product.id)
        const updated = existing
          ? cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...cart, { ...product, quantity }]
        set({ cart: updated, cartCount: computeCount(updated) })
      },

      removeFromCart: (productId) => {
        const updated = get().cart.filter((item) => item.id !== productId)
        set({ cart: updated, cartCount: computeCount(updated) })
      },

      updateCartQuantity: (productId, quantity) => {
        const { cart } = get()
        const updated =
          quantity <= 0
            ? cart.filter((item) => item.id !== productId)
            : cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item,
              )
        set({ cart: updated, cartCount: computeCount(updated) })
      },

      clearCart: () => set({ cart: [], cartCount: 0 }),

      getCartTotal: () =>
        get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),

      // ───────────────────── Wishlist actions ────────────────────
      toggleWishlist: (product) => {
        const { wishlist } = get()
        const exists = wishlist.find((item) => item.id === product.id)
        const updated = exists
          ? wishlist.filter((item) => item.id !== product.id)
          : [...wishlist, product]
        set({ wishlist: updated, wishlistCount: updated.length })
      },

      addToWishlist: (product) => {
        const { wishlist } = get()
        if (wishlist.find((item) => item.id === product.id)) return
        const updated = [...wishlist, product]
        set({ wishlist: updated, wishlistCount: updated.length })
      },

      removeFromWishlist: (productId) => {
        const updated = get().wishlist.filter((item) => item.id !== productId)
        set({ wishlist: updated, wishlistCount: updated.length })
      },

      clearWishlist: () => set({ wishlist: [], wishlistCount: 0 }),

      isInWishlist: (productId) =>
        get().wishlist.some((item) => item.id === productId),
    }),
    {
      name: 'srishringarr-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist only durable state — never the transient UI flags or toasts.
      partialize: (state) => ({
        cart: state.cart,
        cartCount: state.cartCount,
        wishlist: state.wishlist,
        wishlistCount: state.wishlistCount,
        coupon: state.coupon,
      }),
      // Heal counters from arrays in case a migration drifts them apart.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.cartCount = computeCount(state.cart || [])
        state.wishlistCount = (state.wishlist || []).length
      },
    },
  ),
)

export default useStore
