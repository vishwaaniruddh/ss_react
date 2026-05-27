import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import useProducts from '@/hooks/useProducts'
import { ArrowRight } from 'lucide-react'

/**
 * Three rails of real, server-fetched products grouped by intent. Each rail
 * has its own filter pill at the top so visitors can hop between Bridal Wear,
 * Bridal Jewellery, and Heritage Necklace Sets without leaving the homepage.
 */
const RAILS = [
  { key: 'bridal',     label: 'Bridal Wear',       type: 'garments',  category: null,        cta: '/bridal' },
  { key: 'jewellery',  label: 'Bridal Jewellery',  type: 'jewellery', category: 'jewel_main:29', cta: '/jewellery/bridal-jewellery' },
  { key: 'necklaces',  label: 'Heritage Necklaces', type: 'jewellery', category: 'jewel_main:1',  cta: '/jewellery/necklace-sets' },
]

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="aspect-[4/5] rounded-xl mb-4"
        style={{ background: 'rgba(201, 169, 110, 0.06)' }}
      />
      <div className="h-3 rounded w-1/3 mb-2" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
      <div className="h-4 rounded w-3/4 mb-2" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
      <div className="h-4 rounded w-1/4" style={{ background: 'rgba(201, 169, 110, 0.08)' }} />
    </div>
  )
}

export default function FeaturedProducts() {
  const [activeRail, setActiveRail] = useState(RAILS[0].key)
  const rail = useMemo(() => RAILS.find((r) => r.key === activeRail) || RAILS[0], [activeRail])

  const { items, isLoading } = useProducts({
    type: rail.type,
    category: rail.category,
    page: 1,
    sort: 'sku_desc',
  })

  // Cards that fail their image preflight (404, local placeholder, etc.)
  // call `onImageInvalid` — we record the id here and filter them out so
  // the carousel re-flows tightly with no empty slots.
  const [hiddenIds, setHiddenIds] = useState(() => new Set())
  const markInvalid = useCallback((id) => {
    setHiddenIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  // Reset the hidden set when the rail changes — different products,
  // different image checks.
  useEffect(() => {
    setHiddenIds(new Set())
  }, [activeRail])

  // Skip products without an image on the data side, then drop any cards
  // whose runtime preflight failed. Cap at 8 cards so the carousel feels
  // curated.
  const products = items
    .filter((p) => p.hasRealImage && !hiddenIds.has(p.id))
    .slice(0, 8)

  return (
    <section
      className="relative pt-20 pb-20 lg:pt-24 lg:pb-24 overflow-hidden"
      style={{ background: 'var(--color-obsidian)' }}
      id="featured-products"
      aria-label="Featured Products"
    >
      <div className="container-luxury">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <motion.p
              className="label-text mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'var(--color-gold)' }}
            >
              Curated Selection
            </motion.p>
            <SplitText
              className="heading-lg"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Pieces You Can Reserve Today
            </SplitText>
          </div>
          <Button to={rail.cta} variant="ghost" size="sm" id="featured-view-all">
            View All <ArrowRight size={14} />
          </Button>
        </div>

        {/* Rail tabs */}
        <div
          className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1"
        >
          {RAILS.map((r) => {
            const active = r.key === activeRail
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setActiveRail(r.key)}
                className="pl-4 pr-4 pt-2 pb-2 rounded-full text-xs tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: active ? 'var(--color-gold)' : 'transparent',
                  color: active ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
                  fontWeight: active ? 600 : 400,
                }}
                aria-pressed={active}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Swiper carousel */}
      <div className="pl-6 lg:pl-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
        {isLoading ? (
          <div className="flex gap-6 pr-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[320px]">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="container-luxury">
            <p className="body-sm text-center pt-8 pb-8" style={{ color: 'var(--color-ivory-muted)' }}>
              No pieces available in this rail right now. Try another category.
            </p>
          </div>
        ) : (
          <Swiper
            key={activeRail}
            modules={[Autoplay, FreeMode]}
            spaceBetween={24}
            slidesPerView={1.2}
            freeMode={{ enabled: true, momentum: true }}
            autoplay={{ delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1400: { slidesPerView: 4.2 },
            }}
            style={{ paddingBottom: '2rem', paddingRight: '1.5rem' }}
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${activeRail}-${product.id}`}>
                <ProductCard product={product} index={index} onImageInvalid={markInvalid} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}
