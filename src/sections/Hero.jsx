import { useRef, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useIsMobile } from '@/hooks/useMediaQuery'
import heroNecklace from '@/assets/images/hero-necklace.png'

const JewelleryScene = lazy(() => import('@/components/3d/JewelleryScene'))

export default function Hero() {
  const containerRef = useRef(null)
  const mouse = useMousePosition()
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--color-obsidian)' }}
      id="hero-section"
      aria-label="Hero Banner"
    >
      {/* Mouse-follow radial light */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(201, 169, 110, 0.06), transparent 60%)`,
          }}
        />
      )}

      {/* Background parallax image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0.6) 50%, rgba(10, 10, 10, 0.85) 100%)',
            zIndex: 1,
          }}
        />
        <img
          src={heroNecklace}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.3, filter: 'blur(2px)' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Decorative gold lines */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-gold))' }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 opacity-20"
        style={{ background: 'linear-gradient(to top, transparent, var(--color-gold))' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container-luxury w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-32 pb-20 lg:pt-40 lg:pb-12"
        style={{ opacity, y: textY }}
      >
        {/* Left — Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <motion.p
            className="label-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ color: 'var(--color-gold)' }}
          >
            Heritage Craftsmanship Since 1952
          </motion.p>

          <SplitText
            className="heading-xl"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            stagger={0.04}
            delay={0.7}
          >
            Where Tradition Meets Timeless Elegance
          </SplitText>

          <motion.p
            className="body-lg max-w-lg ml-auto mr-auto lg:ml-0 lg:mr-0"
            style={{ color: 'var(--color-ivory-muted)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Discover handcrafted bridal jewellery and couture that celebrates the sacred beauty of Indian heritage — each piece a masterwork of devotion.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <Button to="/shop" variant="primary" size="lg" id="hero-cta-shop">
              Explore Collection
            </Button>
            <Button to="/bridal" variant="secondary" size="lg" id="hero-cta-bridal">
              Bridal Atelier
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex justify-center lg:justify-start gap-8 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            {[
              { value: '70+', label: 'Years of Heritage' },
              { value: '5000+', label: 'Pieces Crafted' },
              { value: '50+', label: 'Master Artisans' },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <span
                  className="text-2xl font-semibold"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                >
                  {stat.value}
                </span>
                <p className="text-[0.65rem] tracking-[0.1em] uppercase mt-1" style={{ color: 'var(--color-ivory-muted)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Scene */}
        <motion.div
          className="relative h-[400px] lg:h-[600px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          {/* Gold glow behind 3D */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
            }}
          />

          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-gold/30 border-t-gold animate-spin" />
              </div>
            }
          >
            <JewelleryScene />
          </Suspense>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}>
          Scroll to Explore
        </span>
        <motion.div
          className="w-5 h-8 rounded-full flex justify-center pt-2"
          style={{ border: '1px solid rgba(201, 169, 110, 0.3)' }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: 'var(--color-gold)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
