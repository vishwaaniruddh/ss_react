import { lazy, Suspense } from 'react'
import SEO from '@/seo/SEO'
import { organizationSchema } from '@/seo/schemas'
import Hero from '@/sections/Hero'
import InViewSection from '@/components/ui/InViewSection'

// Truly lazy below-the-fold sections — only downloaded & mounted when scrolled near
const MarqueeSection = lazy(() => import('@/sections/MarqueeSection'))
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

      <InViewSection minHeight="120px">
        <LazySection><MarqueeSection /></LazySection>
      </InViewSection>

      <InViewSection minHeight="600px">
        <LazySection><BridalShowcase /></LazySection>
      </InViewSection>

      <InViewSection minHeight="600px">
        <LazySection><FeaturedProducts /></LazySection>
      </InViewSection>

      <InViewSection minHeight="500px">
        <LazySection><CollectionsGrid /></LazySection>
      </InViewSection>

      <InViewSection minHeight="400px">
        <LazySection><RentalProcess /></LazySection>
      </InViewSection>

      <InViewSection minHeight="400px">
        <LazySection><VideoSection /></LazySection>
      </InViewSection>

      <InViewSection minHeight="500px">
        <LazySection><TestimonialSection /></LazySection>
      </InViewSection>
    </>
  )
}
