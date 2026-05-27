import { motion } from 'framer-motion'
import {
  Gem, ShieldCheck, Sparkles, Scale, Info, CheckCircle2, Clock, Hand,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'

const sections = [
  {
    number: '01',
    icon: Scale,
    title: 'General Agreements',
    intro:
      'These Terms and Conditions govern your use of the Sri Shringarr website and services, including both the purchase and rental of fine jewellery and apparel. By engaging with our boutique, you acknowledge that you have read, understood, and agree to be bound by these terms.',
    points: [
      'All items remain the property of Sri Shringarr until full payment is received for purchases, or throughout the duration of any rental period.',
      'We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, particularly in cases of suspected fraud or breach of terms.',
    ],
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Rental Policies & Security Deposits',
    intro:
      'Our rental service is designed to provide access to extraordinary pieces for momentous occasions. To ensure the preservation of these delicate items, strict policies apply to all rental agreements.',
    sub: [
      {
        icon: ShieldCheck,
        heading: 'Security Deposits',
        body:
          'A refundable security deposit is required for all rentals. This hold will be placed on your card 48 hours prior to dispatch and released within 3–5 business days upon the safe, undamaged return of the item, pending a rigorous quality inspection by our specialists.',
      },
      {
        icon: Clock,
        heading: 'Rental Period',
        body:
          'Standard rentals are for a 4-day period. Late returns will incur a daily fee equal to 25% of the total rental cost.',
      },
      {
        icon: Sparkles,
        heading: 'Care & Cleaning',
        body:
          'Do not attempt to clean the items. Our specialised dry-cleaning and jewellery polishing services are included in the rental fee.',
      },
    ],
  },
  {
    number: '03',
    icon: Gem,
    title: 'Sales & Custom Orders',
    intro:
      'For items purchased directly or commissioned as bespoke pieces, the following conditions apply regarding payments, modifications, and final delivery.',
    points: [
      'Custom orders require a non-refundable 50% deposit before production begins.',
      'The remaining balance must be settled prior to final delivery or fitting.',
      'Due to the bespoke nature of these items, returns or exchanges are strictly prohibited once production has commenced.',
    ],
  },
  {
    number: '04',
    icon: Hand,
    title: 'Damage & Liability',
    intro:
      'While minor wear and tear is expected during a rental period, significant damage or loss alters the terms of the agreement.',
    points: [
      'In the event of severe damage (missing stones, significant tears in fabric, deep scratches on precious metals), you will be liable for repair costs up to the full retail value of the item.',
      'If an item is lost or stolen while in your possession, you will be charged the full retail replacement value, minus any rental fees already paid.',
    ],
    note: 'Optional insurance is available at checkout for peace of mind.',
  },
]

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Read the terms and conditions for renting and purchasing from Sri Shringarr Fashion Studio."
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
              The Fine Print
            </motion.p>
            <SplitText
              className="heading-xl mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Terms &amp; Conditions
            </SplitText>
            <motion.p
              className="body-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-ivory-muted)' }}
              {...fadeInUp}
            >
              By accessing our services, purchasing, or renting our curated luxury pieces,
              you agree to the terms below — designed to ensure a premium, secure experience
              for every patron.
            </motion.p>
            <motion.div
              className="inline-flex items-center gap-2 mt-8 text-xs tracking-[0.25em] uppercase"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              <Gem size={14} strokeWidth={1.5} />
              <span>Last Updated: October 24, 2024</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pt-12 pb-24" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury max-w-4xl">
          <motion.div
            className="flex flex-col gap-10"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.article
                  key={section.number}
                  variants={staggerItem}
                  className="glass-gold rounded-2xl p-8 md:p-10"
                >
                  <div className="flex items-start gap-5 mb-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(201, 169, 110, 0.12)', border: '1px solid rgba(201, 169, 110, 0.3)' }}
                    >
                      <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-xs tracking-[0.3em] uppercase block mb-1"
                        style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                      >
                        {section.number}
                      </span>
                      <h2
                        className="heading-sm md:heading-md"
                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                      >
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <p
                    className="body-sm md:body-lg mb-6"
                    style={{ color: 'var(--color-ivory-muted)' }}
                  >
                    {section.intro}
                  </p>

                  {section.points && (
                    <ul className="flex flex-col gap-3">
                      {section.points.map((point, i) => (
                        <li key={i} className="flex gap-3 body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                          <CheckCircle2
                            size={16}
                            strokeWidth={1.5}
                            className="shrink-0 mt-0.5"
                            style={{ color: 'var(--color-gold)' }}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.sub && (
                    <div className="grid sm:grid-cols-1 gap-4 mt-2">
                      {section.sub.map((sub) => {
                        const SubIcon = sub.icon
                        return (
                          <div
                            key={sub.heading}
                            className="rounded-xl p-5 flex gap-4"
                            style={{ background: 'rgba(10, 10, 10, 0.4)', border: '1px solid rgba(201, 169, 110, 0.12)' }}
                          >
                            <SubIcon
                              size={18}
                              strokeWidth={1.5}
                              className="shrink-0 mt-0.5"
                              style={{ color: 'var(--color-gold)' }}
                            />
                            <div>
                              <h4
                                className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
                                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                              >
                                {sub.heading}
                              </h4>
                              <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                                {sub.body}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {section.note && (
                    <div
                      className="mt-6 flex items-center gap-3 rounded-xl pl-4 pr-4 pt-3 pb-3"
                      style={{ background: 'rgba(201, 169, 110, 0.08)', border: '1px solid rgba(201, 169, 110, 0.2)' }}
                    >
                      <Info size={16} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                      <p className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-gold)' }}>
                        {section.note}
                      </p>
                    </div>
                  )}
                </motion.article>
              )
            })}

            <motion.div
              variants={staggerItem}
              className="text-center pt-6"
            >
              <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                Have a question about these terms?{' '}
                <a href="/contact" className="hover:underline" style={{ color: 'var(--color-gold)' }}>
                  Speak with a concierge
                </a>
                .
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
