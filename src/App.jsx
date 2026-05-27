import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/routes'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { useLenis } from '@/hooks/useLenis'

export default function App() {
  // Initialize smooth scrolling
  useLenis()

  return (
    <HelmetProvider>
      <LoadingScreen />
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}
