import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HERO_SLIDES = [
  {
    id: 'slide-rental',
    tag: 'PREMIUM FASHION RENTAL',
    titleParts: [
      { text: "Mumbai's Best ", highlight: false },
      { text: 'Rental', highlight: true },
      { text: ' Store for Bridal Fashion', highlight: false },
    ],
    subtitle: 'Why buy when you can rent? Premium bridal lehengas, gowns & statement jewellery — sanitized, tailored to fit, delivered to your door.',
    label: 'Fashion Rental',
    banner: '/banners/rental-collection.webp',
    mobileBanner: '/banners/rental-collection-mobile.webp',
    thumb: '/banners/thumbs/rental-collection.webp',
    ctaPrimary: { label: 'Explore Rentals', path: '/shop' },
    ctaSecondary: { label: 'How It Works', path: '/about' },
    highlights: ['500+ Outfits', '1000+ Jewellery', 'Custom Tailored Fit'],
  },
  {
    id: 'slide-lehenga',
    tag: 'BRIDAL LEHENGA COLLECTION',
    titleParts: [
      { text: 'Royal Bridal Lehengas on ', highlight: false },
      { text: 'Rent', highlight: true },
      { text: ' in ', highlight: false },
      { text: 'Mumbai', highlight: true },
    ],
    subtitle: 'Hand-embroidered zardozi, mirror-work & sequined bridal lehengas from top designers. Complete your dream bridal look.',
    label: 'Bridal Lehengas',
    banner: '/banners/bridal-lehenga.webp',
    mobileBanner: '/banners/bridal-lehenga-mobile.webp',
    thumb: '/banners/thumbs/bridal-lehenga.webp',
    ctaPrimary: { label: 'Browse Lehengas', path: '/bridal/lehenga-choli' },
    ctaSecondary: { label: 'Book a Trial', path: '/contact' },
    highlights: ['Zardozi & Mirror Work', 'Custom Tailored Fit', 'Heirloom Handwork'],
  },
  {
    id: 'slide-gown',
    tag: 'DESIGNER GOWN COLLECTION',
    titleParts: [
      { text: 'Designer Gowns on ', highlight: false },
      { text: 'Rent', highlight: true },
      { text: ' for Every Occasion', highlight: false },
    ],
    subtitle: 'From reception nights to cocktail parties — stunning sequined, layered & couture gowns available on rent for your special evening.',
    label: 'Designer Gowns',
    banner: '/banners/evening-gown.webp',
    mobileBanner: '/banners/evening-gown-mobile.webp',
    thumb: '/banners/thumbs/evening-gown.webp',
    ctaPrimary: { label: 'Explore Gowns', path: '/bridal/evening-gowns' },
    ctaSecondary: { label: 'Indo-Western', path: '/bridal/indo-western-outfits' },
    highlights: ['Cocktail & Reception', 'Sequined Couture', 'Red Carpet Ready'],
  },
  {
    id: 'slide-kundan',
    tag: 'KUNDAN JEWELLERY COLLECTION',
    titleParts: [
      { text: 'Heirloom Kundan & Polki Sets on ', highlight: false },
      { text: 'Rent', highlight: true },
    ],
    subtitle: 'Exquisite Kundan Polki necklace sets, chokers & harams crafted with uncut diamonds, pearls & meenakari — rent the royalty.',
    label: 'Kundan Jewellery',
    banner: '/banners/kundan-jewellery.webp',
    mobileBanner: '/banners/kundan-jewellery-mobile.webp',
    thumb: '/banners/thumbs/kundan-jewellery.webp',
    ctaPrimary: { label: 'Kundan Sets', path: '/jewellery/necklace-sets' },
    ctaSecondary: { label: 'All Jewellery', path: '/jewellery' },
    highlights: ['Polki & Meenakari', 'Bridal Harams', '22k Gold Finish'],
  },
  {
    id: 'slide-necklace',
    tag: 'NECKLACE SETS COLLECTION',
    titleParts: [
      { text: 'Statement Necklace Sets — ', highlight: false },
      { text: 'Rent', highlight: true },
      { text: ' in ', highlight: false },
      { text: 'Mumbai', highlight: true },
    ],
    subtitle: 'Gold-finish temple necklaces, layered harams, chokers & traditional bridal sets paired with matching jhumkas.',
    label: 'Necklace Sets',
    banner: '/banners/necklace-sets.webp',
    mobileBanner: '/banners/necklace-sets-mobile.webp',
    thumb: '/banners/thumbs/necklace-sets.webp',
    ctaPrimary: { label: 'Necklace Sets', path: '/jewellery/necklace-sets' },
    ctaSecondary: { label: 'Earrings', path: '/jewellery/earrings' },
    highlights: ['Temple Jewellery', 'Bridal Chokers', 'Layered Sets'],
  },
  {
    id: 'slide-ad',
    tag: 'AMERICAN DIAMOND COLLECTION',
    titleParts: [
      { text: 'Dazzling American Diamond Jewellery on ', highlight: false },
      { text: 'Rent', highlight: true },
    ],
    subtitle: 'Brilliant CZ stone necklace sets, tiered chokers, chandelier earrings & maang tikkas — the sparkle of diamonds at a fraction of the cost.',
    label: 'American Diamond',
    banner: '/banners/american-diamond.webp',
    mobileBanner: '/banners/american-diamond.webp',
    thumb: '/banners/thumbs/american-diamond.webp',
    ctaPrimary: { label: 'AD Jewellery', path: '/jewellery/necklace-sets' },
    ctaSecondary: { label: 'All Collections', path: '/jewellery' },
    highlights: ['CZ Stone Sets', 'Bridal & Party Wear', 'Brilliant Sparkle'],
  },
]

const SLIDE_DURATION = 8000

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const sliderRef = useRef(null)
  const isFirstMount = useRef(true)

  const totalSlides = HERO_SLIDES.length

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const selectSlide = useCallback((index) => {
    setCurrent(index)
  }, [])

  // Mark first mount as complete after initial paint
  useEffect(() => {
    isFirstMount.current = false
  }, [])

  // Lazily preload ONLY the upcoming slide to conserve bandwidth on mobile
  useEffect(() => {
    const nextIdx = (current + 1) % totalSlides
    const nextSlide = HERO_SLIDES[nextIdx]
    if (!nextSlide) return

    const timer = setTimeout(() => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
      const targetSrc = isMobile && nextSlide.mobileBanner ? nextSlide.mobileBanner : nextSlide.banner
      if (targetSrc) {
        const img = new Image()
        img.src = targetSrc
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [current, totalSlides])

  // Autoplay
  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [nextSlide, current])

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [nextSlide, prevSlide])

  // Touch swipe support
  const minSwipe = 40
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const d = touchStart - touchEnd
    if (d > minSwipe) nextSlide()
    if (d < -minSwipe) prevSlide()
  }

  // Scroll active thumbnail smoothly into view (only on user interaction, not on initial mount)
  useEffect(() => {
    if (isFirstMount.current) return
    if (sliderRef.current) {
      const activeBtn = sliderRef.current.querySelector('[data-active="true"]')
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [current])

  const active = HERO_SLIDES[current]

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      id="hero-section"
      aria-label="Sri Shringaar Hero Banner"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        height: '100dvh',
        minHeight: '560px',
      }}
    >
      {/* ═══════ FULL-BLEED BACKGROUND WITH RESPONSIVE PICTURE ═══════ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={isFirstMount.current ? false : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <picture className="absolute inset-0 w-full h-full">
            {active.mobileBanner && (
              <source media="(max-width: 768px)" srcSet={active.mobileBanner} type="image/webp" />
            )}
            <img
              src={active.banner}
              alt={active.label}
              className="w-full h-full object-cover object-center sm:object-right md:object-center"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="1440"
              height="768"
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* ═══════ RESPONSIVE GRADIENT OVERLAYS ═══════ */}
      {/* Desktop side gradient */}
      <div
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.6) 28%, rgba(10,10,10,0.2) 50%, transparent 68%)',
        }}
      />
      {/* Mobile vertical overlay for readability across full-height portraits */}
      <div
        className="block md:hidden absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0.2) 65%, rgba(10,10,10,0.35) 100%)',
        }}
      />

      {/* Bottom gradient for slider navigation bar */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 15%, transparent 30%)',
        }}
      />
      {/* Top subtle vignette for transparent navbar readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 18%)',
        }}
      />

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="relative z-10 h-full flex items-end md:items-center pt-20 sm:pt-24 lg:pt-[88px] pb-20 sm:pb-24 lg:pb-24">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-xl lg:max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id + '-c'}
                initial={isFirstMount.current ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="space-y-3.5 sm:space-y-5"
              >
                {/* Eyebrow tag */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.1)] backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C9A96E]">
                    {active.tag}
                  </span>
                </motion.div>

                {/* ─── HEADLINE with highlighted words ─── */}
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] font-serif leading-[1.14] sm:leading-[1.1] tracking-tight text-[#FAF6F0]"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.4)' }}
                >
                  {active.titleParts.map((part, i) =>
                    part.highlight ? (
                      <span
                        key={i}
                        className="relative inline-block"
                        style={{
                          color: '#C9A96E',
                          textShadow: '0 0 25px rgba(201,169,110,0.4)',
                        }}
                      >
                        {part.text}
                        {/* Gold underline accent */}
                        <span
                          className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #C9A96E 0%, #D4B87A 50%, transparent 100%)',
                          }}
                        />
                      </span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-[15px] text-[#E0D8C8]/85 font-sans font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                  {active.subtitle}
                </p>

                {/* Highlight chips */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                  {active.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.08)] text-[#C9A96E] backdrop-blur-sm"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
                  <Link
                    to={active.ctaPrimary.path}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 bg-[#C9A96E] hover:bg-[#D4B87A] text-[#0A0A0A] text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase rounded transition-all duration-300 shadow-[0_4px_25px_rgba(201,169,110,0.35)] hover:shadow-[0_4px_40px_rgba(201,169,110,0.55)] cursor-pointer"
                  >
                    {active.ctaPrimary.label}
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to={active.ctaSecondary.path}
                    className="px-5 py-2.5 sm:px-7 sm:py-3.5 border border-[rgba(255,255,255,0.25)] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] text-[#FAF6F0] text-[11px] sm:text-xs font-medium tracking-[0.15em] uppercase rounded transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    {active.ctaSecondary.label}
                  </Link>
                </div>

                {/* Trust line */}
                <div className="flex items-center gap-2.5 sm:gap-4 pt-2 sm:pt-3 text-[9px] sm:text-[10px] tracking-widest uppercase text-[#C9A96E]/75 font-sans flex-wrap">
                  <span>✦ Sanitized &amp; Dry Cleaned</span>
                  <span className="w-px h-3 bg-[#C9A96E]/30 hidden sm:inline-block" />
                  <span>✦ Custom Tailored Fit</span>
                  <span className="w-px h-3 bg-[#C9A96E]/30 hidden sm:inline-block" />
                  <span>✦ Pan India Delivery</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ═══════ NAV ARROWS (Hidden on mobile touch screens for cleaner view) ═══════ */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide() }}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,10,0.4)] hover:bg-[#C9A96E] hover:border-[#C9A96E] text-white/70 hover:text-[#0A0A0A] items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide() }}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,10,0.4)] hover:bg-[#C9A96E] hover:border-[#C9A96E] text-white/70 hover:text-[#0A0A0A] items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ═══════════════════════════════════════════════════════════
          RESPONSIVE BOTTOM SLIDER — Thumbnail strip + progress
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Frosted glass bar */}
        <div className="bg-[rgba(10,10,10,0.75)] backdrop-blur-2xl border-t border-[rgba(201,169,110,0.15)]">
          <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-12">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-1 sm:py-0" ref={sliderRef}>

              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === current
                return (
                  <button
                    key={slide.id}
                    type="button"
                    data-active={isActive}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); selectSlide(idx) }}
                    className={`relative flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3.5 transition-all duration-300 cursor-pointer group border-b-2 ${
                      isActive
                        ? 'border-[#C9A96E] bg-[rgba(201,169,110,0.1)]'
                        : 'border-transparent hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(201,169,110,0.3)]'
                    }`}
                    aria-label={`Go to ${slide.label}`}
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg overflow-hidden border transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'border-[#C9A96E] shadow-[0_0_10px_rgba(201,169,110,0.3)]'
                          : 'border-[rgba(255,255,255,0.1)] group-hover:border-[rgba(201,169,110,0.3)]'
                      }`}
                    >
                      <img
                        src={slide.thumb || slide.mobileBanner || slide.banner}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="40"
                        height="40"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(201,169,110,0.25)] to-transparent" />
                      )}
                    </div>

                    {/* Label + progress */}
                    <div className="flex flex-col items-start min-w-0">
                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors duration-300 ${
                          isActive ? 'text-[#C9A96E]' : 'text-[#E0D8C8]/60 group-hover:text-[#E0D8C8]/90'
                        }`}
                      >
                        {slide.label}
                      </span>

                      {/* Mini progress bar */}
                      {isActive && (
                        <div className="w-full h-[2px] bg-[rgba(201,169,110,0.15)] rounded-full mt-1 overflow-hidden">
                          <motion.div
                            key={current}
                            className="h-full w-full bg-[#C9A96E] rounded-full origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            style={{ transformOrigin: 'left' }}
                            transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}

              {/* Slide counter — far right */}
              <div className="ml-auto pl-3 pr-2 flex items-center gap-1.5 shrink-0">
                <span className="text-xs sm:text-sm font-serif text-[#C9A96E] tracking-widest tabular-nums">
                  {String(current + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#E0D8C8]/30 font-sans">/</span>
                <span className="text-[11px] sm:text-xs text-[#E0D8C8]/40 font-sans tabular-nums">
                  {String(totalSlides).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
