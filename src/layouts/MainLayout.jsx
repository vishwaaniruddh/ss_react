import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import SearchOverlay from '@/components/ui/SearchOverlay'
import Toaster from '@/components/ui/Toaster'
import ComparisonBar from '@/components/ui/ComparisonBar'

export default function MainLayout() {
  const location = useLocation()

  useEffect(() => {
    // Perform a tiny scroll to trigger ScrollTrigger, Lenis, or other window resize/scroll recalculations
    const timer = setTimeout(() => {
      window.scrollBy(0, 1)
      window.scrollBy(0, -1)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <PageWrapper>
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </PageWrapper>
      <SearchOverlay />
      <Toaster />
      <ComparisonBar />
    </div>
  )
}
