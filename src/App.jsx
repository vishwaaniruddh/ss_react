import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/routes'
import { useLenis } from '@/hooks/useLenis'
import useAuth from '@/store/useAuth'

export default function App() {
  // Initialize smooth scrolling (desktop only)
  useLenis()

  // Check auth session on app load
  const checkSession = useAuth((s) => s.checkSession)
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}
