import { lazy, Suspense } from 'react'
import SEO from '@/seo/SEO'
import { organizationSchema } from '@/seo/schemas'
import Hero from '@/sections/Hero'
import MarqueeSection from '@/sections/MarqueeSection'

// Lazy-load below-fold sections to reduce initial bundle and main-thread work
const BridalShowcase = lazy(() => import('@/sections/BridalShowcase'))
const FeaturedProducts = lazy(() => import('@/sections/FeaturedProducts'))
const CollectionsGrid = lazy(() => import('@/sections/CollectionsGrid'))
const RentalProcess = lazy(() => import('@/sections/RentalProcess'))
const VideoSection = lazy(() => import('@/sections/VideoSection'))
const TestimonialSection = lazy(() => import('@/sections/TestimonialSection'))

function LazySection({ children }) {
  return <Suspense fallback={null}>{children}</Suspense>
}

export default function Home() {
  return (
    <>
      <SEO
        title="Bridal Outfits & Jewellery on Rent in Mumbai"
        description="Sri Shringaar — Mumbai's premier fashion rental studio to rent bridal lehengas, gowns, Kundan, Polki & American Diamond jewellery."
        schema={organizationSchema()}
      />

      <Hero />
      <MarqueeSection />
      <LazySection><BridalShowcase /></LazySection>
      <LazySection><FeaturedProducts /></LazySection>
      <LazySection><CollectionsGrid /></LazySection>
      <LazySection><RentalProcess /></LazySection>
      <LazySection><VideoSection /></LazySection>
      <LazySection><TestimonialSection /></LazySection>
    </>
  )
}
