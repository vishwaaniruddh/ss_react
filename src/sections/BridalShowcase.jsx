import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import bridalHero from '@/assets/images/bridal-hero.webp'
import collectionTemple from '@/assets/images/collection-temple.webp'

export default function BridalShowcase() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const image2Y = useTransform(scrollYProgress, [0, 1], ['-5%', '15%'])
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  return (
    <section
      ref={containerRef}
      className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
      style={{ background: 'var(--color-obsidian)' }}
      id="bridal-showcase"
      aria-label="Bridal Showcase"
    >
      {/* Subtle bg texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, var(--color-gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-luxury relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            className="label-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ color: 'var(--color-gold)' }}
          >
            The Bridal Atelier
          </motion.p>
          <SplitText
            className="heading-lg max-w-3xl ml-auto mr-auto"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            stagger={0.03}
          >
            A Sacred Celebration of Love & Legacy
          </SplitText>
        </div>

        {/* Parallax image grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left large image */}
          <motion.div
            className="lg:col-span-7 relative overflow-hidden rounded-2xl aspect-[4/5]"
            style={{ y: imageY }}
          >
            <img
              src={bridalHero}
              alt="Indian bride in deep maroon bridal lehenga with traditional gold jewellery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(transparent 50%, rgba(10, 10, 10, 0.6))',
              }}
            />
            {/* Caption overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <p className="label-text mb-2" style={{ color: 'var(--color-gold)' }}>Bridal Couture 2024</p>
              <h2
                className="text-2xl lg:text-3xl font-medium"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
              >
                The Maharani Collection
              </h2>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Small image */}
            <motion.div
              className="relative overflow-hidden rounded-2xl aspect-square"
              style={{ y: image2Y }}
            >
              <img
                src={collectionTemple}
                alt="South Indian temple jewellery collection arranged on dark marble"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(transparent 40%, rgba(10, 10, 10, 0.5))',
                }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="label-text mb-1" style={{ color: 'var(--color-gold)' }}>Temple Heritage</p>
                <h4
                  className="text-lg font-medium"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                >
                  Divine Artistry in Gold
                </h4>
              </div>
            </motion.div>

            {/* Text block */}
            <motion.div
              className="glass-gold rounded-2xl p-8 lg:p-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h4
                className="heading-sm mb-4"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
              >
                Bespoke Bridal Experience
              </h4>
              <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
                Every bride deserves to feel like royalty. Our master artisans work intimately
                with you to create one-of-a-kind pieces that become treasured heirlooms,
                passed down through generations.
              </p>
              <Button to="/bridal" variant="secondary" size="sm" id="bridal-showcase-cta">
                Book a Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
