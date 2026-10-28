import { useEffect } from 'react'
import SEO from '@/seo/SEO'
import { organizationSchema } from '@/seo/schemas'
import HeroV2 from '@/sections/home-v2/HeroV2'
import ValueBadgesBar from '@/sections/home-v2/ValueBadgesBar'
import CoutureCollection from '@/sections/home-v2/CoutureCollection'
import JewelleryShowcaseV2 from '@/sections/home-v2/JewelleryShowcaseV2'
import WhyRentSection from '@/sections/home-v2/WhyRentSection'
import HygieneCareSection from '@/sections/home-v2/HygieneCareSection'
import FashionThatCaresSection from '@/sections/home-v2/FashionThatCaresSection'
import CustomDesignedSection from '@/sections/home-v2/CustomDesignedSection'
import FooterV2 from '@/sections/home-v2/FooterV2'

export default function HomeV2() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-[#08090A] text-[#FAF6F0] min-h-screen">
      <SEO
        title="Sri Shringarr — Rent the Look. Own the Moment. | Designer Outfits & Jewellery"
        description="Rent exclusive designer couture, bridal lehengas, evening gowns, and handcrafted jewellery. Sri Shringarr Fashion Studio since 2009."
        schema={organizationSchema()}
      />

      {/* 1. Hero Banner */}
      <HeroV2 />

      {/* 2. Value Badges Bar (Rental Outfits, Jewellery, Styling, Hygiene, Pre-Loved) */}
      <ValueBadgesBar />

      {/* 3. Couture Collection (5 Outfits with Rent Pricing) */}
      <CoutureCollection />

      {/* 4. Luxury Jewellery On Rent (4 Pieces with Rent Pricing) */}
      <JewelleryShowcaseV2 />

      {/* 5. Why Rent? (5 Value Pillars) */}
      <WhyRentSection />

      {/* 6. Hygiene & Care (5 Quality Checkpoints + Gold Seal) */}
      <HygieneCareSection />

      {/* 7. Fashion That Cares (Sustainability & Circular Fashion) */}
      <FashionThatCaresSection />

      {/* 8. Custom Designed Outfits (Bespoke Atelier Showcase) */}
      <CustomDesignedSection />

      {/* 9. Specialized Footer V2 */}
      <FooterV2 />
    </div>
  )
}
