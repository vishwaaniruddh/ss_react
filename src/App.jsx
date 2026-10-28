import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/routes'
import { useLenis } from '@/hooks/useLenis'
import useAuth from '@/store/useAuth'

export default function App() {
  // Initialize smooth scrolling (desktop only)
  useLenis()

  // Check auth session when main thread is idle
  const checkSession = useAuth((s) => s.checkSession)
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => checkSession())
      return () => cancelIdleCallback(id)
    } else {
      const id = setTimeout(checkSession, 1500)
      return () => clearTimeout(id)
    }
  }, [checkSession])

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}
