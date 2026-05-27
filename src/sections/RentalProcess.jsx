import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, CalendarCheck, Gem, Truck, ArrowRight,
} from 'lucide-react'
import SplitText from '@/components/ui/SplitText'
import { staggerContainer, staggerItem } from '@/animations/variants'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Browse the Archive',
    body:
      'Explore curated lehengas, gowns, and heritage jewellery. Filter by occasion, designer, era, or material.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Reserve Securely',
    body:
      'Select pickup and return dates on the live calendar. We hold the piece against your booking — no overlap.',
  },
  {
    number: '03',
    icon: Gem,
    title: 'Wear with Grace',
    body:
      'Your selection arrives in our signature velvet-lined boxes via insured courier — pristine, custom-fitted, ready.',
  },
  {
    number: '04',
    icon: Truck,
    title: 'Effortless Return',
    body:
      'Use the pre-paid return label. We handle dry-cleaning and inspection. Your deposit refunds within days.',
  },
]

export default function RentalProcess() {
  return (
    <section
      className="relative pt-20 pb-20 lg:pt-24 lg:pb-24 overflow-hidden"
      style={{ background: 'var(--color-charcoal)' }}
      id="rental-process"
      aria-label="How rental works"
    >
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl ml-auto mr-auto">
          <motion.p
            className="label-text mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)' }}
          >
            The Concierge Service
          </motion.p>
          <SplitText
            className="heading-lg mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            Renting Couture, Effortlessly
          </SplitText>
          <motion.p
            className="body-sm"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            Don't repeat it — rent it. Wear extraordinary pieces for your moment, return them with grace,
            and let someone else's story begin.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="rounded-2xl p-6 relative overflow-hidden group"
                style={{
                  background: 'rgba(10, 10, 10, 0.5)',
                  border: '1px solid rgba(201, 169, 110, 0.12)',
                }}
                whileHover={{ y: -4, transition: { duration: 0.4 } }}
              >
                <span
                  className="absolute -top-2 -right-1 text-[5rem] font-serif leading-none opacity-[0.06] pointer-events-none select-none"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {step.number}
                </span>

                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:-rotate-6"
                  style={{
                    background: 'rgba(201, 169, 110, 0.12)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                </div>

                <span
                  className="text-[10px] tracking-[0.3em] uppercase block mb-2"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Step {step.number}
                </span>
                <h3
                  className="text-lg mb-2"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-ivory)',
                    fontWeight: 500,
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-[13px]" style={{ color: 'var(--color-ivory-muted)', lineHeight: 1.6 }}>
                  {step.body}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-semibold transition-colors duration-300 hover:text-gold"
            style={{
              color: 'var(--color-ivory-muted)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Learn more about the process
            <ArrowRight size={13} strokeWidth={1.7} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
