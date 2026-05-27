import SEO from '@/seo/SEO'
import { organizationSchema } from '@/seo/schemas'
import Hero from '@/sections/Hero'
import MarqueeSection from '@/sections/MarqueeSection'
import BridalShowcase from '@/sections/BridalShowcase'
import FeaturedProducts from '@/sections/FeaturedProducts'
import CollectionsGrid from '@/sections/CollectionsGrid'
import RentalProcess from '@/sections/RentalProcess'
import VideoSection from '@/sections/VideoSection'
import TestimonialSection from '@/sections/TestimonialSection'

export default function Home() {
  return (
    <>
      <SEO
        title="Sri Shringaar — Luxury Indian Bridal Jewellery & Heritage Apparels"
        description="Discover exquisite handcrafted Indian bridal jewellery and heritage apparels. Celebrating 70+ years of sacred craftsmanship from the master artisans of Jaipur."
        schema={organizationSchema()}
      />

      <Hero />
      <MarqueeSection />
      <BridalShowcase />
      <FeaturedProducts />
      <CollectionsGrid />
      <RentalProcess />
      <VideoSection />
      <TestimonialSection />
    </>
  )
}
