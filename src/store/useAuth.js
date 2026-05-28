import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { API_BASE_URL } from '@/utils/api'

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,

      /**
       * Check session with backend on app load
       */
      checkSession: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/session.php`, { credentials: 'include' })
          const data = await res.json()
          if (data.loggedIn && data.user) {
            set({ user: data.user, isLoggedIn: true })
          } else {
            set({ user: null, isLoggedIn: false })
          }
        } catch {
          // Silently fail — user stays logged out
        }
      },

      /**
       * Login
       */
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (data.status === 'success') {
            set({ user: data.user, isLoggedIn: true, isLoading: false })
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, message: data.message }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: 'Network error. Please try again.' }
        }
      },

      /**
       * Register
       */
      register: async ({ firstName, lastName, email, phone, password }) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, phone, password }),
          })
          const data = await res.json()
          if (data.status === 'success') {
            set({ user: data.user, isLoggedIn: true, isLoading: false })
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, message: data.message }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: 'Network error. Please try again.' }
        }
      },

      /**
       * Logout
       */
      logout: async () => {
        try {
          await fetch(`${API_BASE_URL}/logout.php`, {
            method: 'POST',
            credentials: 'include',
          })
        } catch {
          // Continue with local logout even if API fails
        }
        set({ user: null, isLoggedIn: false })
      },

      /**
       * Update profile
       */
      updateProfile: async (profileData) => {
        try {
          const formData = new URLSearchParams()
          formData.append('action', 'update_profile')
          Object.entries(profileData).forEach(([key, val]) => formData.append(key, val))

          const res = await fetch(`${API_BASE_URL}/update-account.php`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          })
          const data = await res.json()
          if (data.status === 'success') {
            set((s) => ({
              user: { ...s.user, firstName: profileData.fname, lastName: profileData.lname, phone: profileData.mobile, gender: profileData.gender },
            }))
          }
          return data
        } catch {
          return { status: 'error', message: 'Network error' }
        }
      },
    }),
    {
      name: 'srishringarr-auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
)

export default useAuth
