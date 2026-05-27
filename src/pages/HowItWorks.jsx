import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, CalendarCheck, Gem, Truck, ShieldCheck, Sparkles, ArrowRight,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse the Archive',
    body:
      'Explore our curated collection of heritage jewellery and bridal wear. Filter by occasion, designer, era, or material to discover the perfect statement piece for your event.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Reserve Securely',
    body:
      'Select your reservation dates through our intuitive calendar. We recommend booking 2 to 4 weeks in advance during peak wedding seasons to guarantee availability of your chosen treasures.',
  },
  {
    number: '03',
    icon: Gem,
    title: 'Wear with Grace',
    body:
      'Your selection arrives flawlessly packaged in our signature velvet-lined boxes via secure, insured courier. Step into your occasion radiating confidence, adorned in authenticated luxury.',
  },
  {
    number: '04',
    icon: Truck,
    title: 'Effortless Return',
    body:
      'Repackage the item in its original bespoke box. Use the pre-paid, fully insured shipping label provided. Drop it off or schedule a courier pickup. We handle all cleaning and maintenance.',
  },
]

const promises = [
  {
    icon: ShieldCheck,
    title: 'Security Deposit',
    body:
      'Given the value and irreplaceable nature of our heritage pieces, a fully refundable security deposit is temporarily authorised on your card during the rental period. The hold is released immediately upon safe return and inspection.',
  },
  {
    icon: Sparkles,
    title: 'Impeccable Care',
    body:
      'Every garment and piece of jewellery undergoes professional-grade cleaning and meticulous inspection by our master artisans before and after every lease — specialised techniques for delicate silks and precious stones.',
  },
]

export default function HowItWorks() {
  return (
    <>
      <SEO
        title="How Rental Works"
        description="The Sri Shringarr concierge rental process — browse, reserve, wear with grace, and return effortlessly."
      />

      {/* Hero */}
      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="text-center mb-12">
            <motion.p
              className="label-text mb-4"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              The Concierge Service
            </motion.p>
            <SplitText
              className="heading-xl mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              The Art of Renting Elegance
            </SplitText>
            <motion.p
              className="body-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-ivory-muted)' }}
              {...fadeInUp}
            >
              Experience the grandeur of high jewellery and couture without the commitment.
              Our meticulously curated rental process makes absolute luxury effortless,
              secure, and impeccably maintained for your momentous occasions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pt-20 pb-20" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
          >
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  variants={staggerItem}
                  className="glass-gold rounded-2xl p-8 lg:p-10 relative overflow-hidden group"
                >
                  <span
                    className="absolute -top-4 -right-2 text-[7rem] font-serif leading-none opacity-[0.06] pointer-events-none select-none"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
                    style={{
                      background: 'rgba(201, 169, 110, 0.12)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                    }}
                  >
                    <Icon size={22} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <span
                    className="text-xs tracking-[0.3em] uppercase block mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Step {step.number}
                  </span>
                  <h3
                    className="heading-sm mb-4"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                    {step.body}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="pt-20 pb-20" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="text-center mb-14">
            <motion.p
              className="label-text mb-4"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              Our Commitment
            </motion.p>
            <SplitText
              className="heading-lg"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              The Sri Shringarr Promise
            </SplitText>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {promises.map((promise) => {
              const Icon = promise.icon
              return (
                <motion.div
                  key={promise.title}
                  variants={staggerItem}
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: 'rgba(201, 169, 110, 0.04)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: 'rgba(201, 169, 110, 0.1)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                    }}
                  >
                    <Icon size={24} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <h3
                    className="heading-sm mb-4"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    {promise.title}
                  </h3>
                  <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                    {promise.body}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/shop">
              <Button variant="primary" size="lg" id="hiw-cta-shop">
                Start Browsing Collection <ArrowRight size={14} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
