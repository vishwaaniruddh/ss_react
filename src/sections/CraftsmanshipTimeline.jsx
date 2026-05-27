import { motion } from 'framer-motion'
import { MILESTONES } from '@/utils/constants'
import { staggerContainer, staggerItem } from '@/animations/variants'
import SplitText from '@/components/ui/SplitText'
import craftsmanship from '@/assets/images/craftsmanship.png'

export default function CraftsmanshipTimeline() {
  return (
    <section
      className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
      style={{ background: 'var(--color-charcoal)' }}
      id="craftsmanship-timeline"
      aria-label="Craftsmanship Timeline"
    >
      <div className="container-luxury">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div>
            <motion.p
              className="label-text mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'var(--color-gold)' }}
            >
              Our Heritage
            </motion.p>
            <SplitText
              className="heading-lg mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Centuries of Craftsmanship
            </SplitText>
            <motion.p
              className="body-lg max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--color-ivory-muted)' }}
            >
              From the anvils of Jaipur to the hands of master goldsmiths, each piece carries
              forward the legacy of ancient Indian jewellery-making traditions — kundan, meenakari,
              and temple artistry.
            </motion.p>
          </div>

          {/* Craftsmanship image */}
          <motion.div
            className="relative overflow-hidden rounded-2xl aspect-[4/3]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={craftsmanship}
              alt="Master artisan hands carefully setting gemstones in gold jewellery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.3), rgba(201, 169, 110, 0.1))',
              }}
            />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Gold connecting line */}
          <div
            className="absolute top-0 bottom-0 left-4 lg:left-1/2 lg:-translate-x-1/2 w-px"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-gold), transparent)',
              opacity: 0.3,
            }}
          />

          {MILESTONES.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-16 mb-16 last:mb-0 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
              variants={staggerItem}
            >
              {/* Content */}
              <div className={`flex-1 pl-12 lg:pl-0 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                <motion.div
                  className="glass-gold rounded-xl p-6 lg:p-8 inline-block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="text-3xl lg:text-4xl font-bold mb-2 block"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
                  >
                    {milestone.year}
                  </span>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    {milestone.title}
                  </h3>
                  <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                    {milestone.description}
                  </p>
                </motion.div>
              </div>

              {/* Node dot */}
              <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-0 lg:top-1/2 lg:-translate-y-1/2">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: 'var(--color-gold)',
                    boxShadow: '0 0 20px rgba(201, 169, 110, 0.4)',
                  }}
                  whileInView={{ scale: [0, 1.3, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
