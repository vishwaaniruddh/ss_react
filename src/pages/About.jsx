import { motion } from 'framer-motion'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'
import { MILESTONES } from '@/utils/constants'
import craftsmanship from '@/assets/images/craftsmanship.png'
import bridalHero from '@/assets/images/bridal-hero.png'

export default function About() {
  return (
    <>
      <SEO title="Our Story" description="Discover the heritage and craftsmanship behind Sri Shringaar — 70+ years of creating India's finest bridal jewellery." />

      {/* Hero */}
      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p className="label-text mb-4" style={{ color: 'var(--color-gold)' }} {...fadeInUp}>Our Heritage</motion.p>
              <SplitText className="heading-xl mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                A Legacy Written in Gold
              </SplitText>
              <motion.p className="body-lg mb-6" style={{ color: 'var(--color-ivory-muted)' }} {...fadeInUp}>
                Founded in 1952 by master goldsmith Shri Ramesh Kumar in the heart of Jaipur, Sri Shringaar began as a humble workshop dedicated to preserving the dying art of traditional Indian jewellery making.
              </motion.p>
              <motion.p className="body-lg" style={{ color: 'var(--color-ivory-muted)' }} {...fadeInUp}>
                Today, we stand as custodians of centuries-old techniques — kundan, meenakari, and temple jewellery — bringing them to life for the modern Indian bride who seeks authenticity in every detail.
              </motion.p>
            </div>
            <motion.div className="relative overflow-hidden rounded-2xl aspect-[4/5]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <img src={craftsmanship} alt="Master artisan at work" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pt-20 pb-20" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury">
          <SplitText className="heading-lg text-center mb-16" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Our Pillars
          </SplitText>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {[
              { title: 'Heritage', text: 'Every technique we use has been perfected over centuries. We are the bridge between ancient artistry and modern elegance.' },
              { title: 'Devotion', text: 'Each piece takes 200+ hours of painstaking craftsmanship. Our artisans pour their soul into every setting, every polish.' },
              { title: 'Authenticity', text: 'BIS Hallmarked gold, ethically sourced gemstones, and transparent pricing. We believe luxury should never compromise integrity.' },
            ].map((value) => (
              <motion.div key={value.title} variants={staggerItem} className="glass-gold rounded-2xl p-8 text-center">
                <h3 className="heading-sm mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{value.title}</h3>
                <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Full width image */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={bridalHero} alt="Sri Shringaar craftsmanship" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent, rgba(10,10,10,0.6))' }} />
      </section>
    </>
  )
}
