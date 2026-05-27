import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CalendarHeart, Truck, RotateCcw, Sparkles, ChevronDown, MessageCircle, Search,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import { fadeInUp } from '@/animations/variants'

const categories = [
  {
    id: 'rentals',
    icon: CalendarHeart,
    title: 'Rentals',
    items: [
      {
        q: 'How does the rental process work?',
        a: 'Our rental process is designed to be as seamless as a traditional purchase. Select your desired piece, choose your dates on our availability calendar, and add to cart. Once your order is placed, our concierges will carefully prepare and package your item, ensuring it arrives in pristine condition at least one day before your event.',
      },
      {
        q: 'What is the standard rental duration?',
        a: 'Standard rentals are for a 4-day period. This allows ample time for your event, fittings, and a relaxed return. Extended durations can be arranged on request — please contact our concierge team in advance.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'For peak wedding seasons, we recommend booking 2 to 4 weeks in advance to guarantee the availability of your chosen treasures. Last-minute reservations are subject to inventory and concierge approval.',
      },
      {
        q: 'Is a security deposit required?',
        a: 'Yes. A fully refundable security deposit is authorised on your card 48 hours prior to dispatch. The hold is released within 3–5 business days upon the safe, undamaged return of the item, following inspection by our specialists.',
      },
    ],
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Shipping',
    items: [
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to select international destinations through fully insured, authenticated couriers. International orders may be subject to customs duties and longer lead times. Please contact our concierge team to confirm availability for your region.',
      },
      {
        q: 'When will my item arrive?',
        a: 'Domestic rentals are dispatched to arrive at least one day before your event date. You will receive a tracking link as soon as the parcel is in transit. For purchases, standard delivery is 5–7 business days within India.',
      },
      {
        q: 'How are items packaged?',
        a: 'Every piece travels in our signature velvet-lined boxes, sealed within an outer protective carton. Both the inner box and the pre-paid return label are reused for return shipping.',
      },
    ],
  },
  {
    id: 'returns',
    icon: RotateCcw,
    title: 'Returns',
    items: [
      {
        q: 'How do I return a rental?',
        a: 'Repackage the item in its original bespoke box. Affix the pre-paid, fully insured return label provided with your order. Drop the parcel at the courier counter or schedule a pickup through the link emailed to you.',
      },
      {
        q: 'What happens if I return a rental late?',
        a: 'Late returns incur a daily fee equal to 25% of the total rental cost. We kindly request that you contact our concierge as soon as possible if you anticipate a delay so we can arrange an extension where feasible.',
      },
      {
        q: 'Are purchased items returnable?',
        a: 'Off-the-shelf purchases may be returned within 7 days of delivery in unworn, unaltered condition with original packaging and certification. Bespoke and custom commissioned pieces are not eligible for return once production has commenced.',
      },
    ],
  },
  {
    id: 'product-care',
    icon: Sparkles,
    title: 'Product Care',
    items: [
      {
        q: 'How should I care for the items during my rental?',
        a: 'Avoid contact with perfumes, lotions, and water. Store the piece in the velvet-lined box when not being worn. Do not attempt to clean or polish the item — our specialised dry-cleaning and jewellery polishing services are included in the rental fee.',
      },
      {
        q: 'What if I accidentally damage an item?',
        a: 'Minor wear and tear is expected and covered. For significant damage (missing stones, deep scratches, fabric tears), repair charges may apply up to the full retail value. Optional insurance is available at checkout for additional peace of mind.',
      },
      {
        q: 'How do you authenticate your pieces?',
        a: 'Every piece is authenticated by our master artisans and accompanied by certification where applicable. Jewellery is BIS hallmarked, and gemstones are sourced through ethically vetted suppliers.',
      },
    ],
  },
]

function FAQItem({ q, a, isOpen, onToggle, id }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? 'rgba(201, 169, 110, 0.06)' : 'rgba(10, 10, 10, 0.3)',
        border: `1px solid ${isOpen ? 'rgba(201, 169, 110, 0.3)' : 'rgba(201, 169, 110, 0.1)'}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 pl-6 pr-6 pt-5 pb-5 text-left cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        id={`${id}-trigger`}
      >
        <span
          className="body-sm md:body-lg flex-1"
          style={{
            color: isOpen ? 'var(--color-gold)' : 'var(--color-ivory)',
            fontFamily: 'var(--font-serif)',
            transition: 'color 0.3s ease',
          }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className="shrink-0 transition-transform duration-300"
          style={{
            color: 'var(--color-gold)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p
              className="body-sm pl-6 pr-6 pb-6"
              style={{ color: 'var(--color-ivory-muted)', lineHeight: 1.7 }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('rentals')
  const [openItem, setOpenItem] = useState(null)
  const [query, setQuery] = useState('')

  const trimmedQuery = query.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    if (!trimmedQuery) return categories
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.q.toLowerCase().includes(trimmedQuery) ||
            it.a.toLowerCase().includes(trimmedQuery)
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [trimmedQuery])

  const isSearching = trimmedQuery.length > 0
  const visibleCategories = isSearching
    ? filteredCategories
    : categories.filter((c) => c.id === activeCategory)

  return (
    <>
      <SEO
        title="FAQs"
        description="Frequently asked questions about Sri Shringarr rentals, shipping, returns, and product care."
      />

      {/* Hero */}
      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="text-center mb-10">
            <motion.p
              className="label-text mb-4"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              Support
            </motion.p>
            <SplitText
              className="heading-xl mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Frequently Asked Questions
            </SplitText>
            <motion.p
              className="body-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-ivory-muted)' }}
              {...fadeInUp}
            >
              Find answers to common questions about our services, shipping, and caring
              for your luxury pieces.
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            className="max-w-xl mx-auto relative"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-gold)' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full pl-12 pr-5 pt-3.5 pb-3.5 rounded-full text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30"
              style={{
                background: 'rgba(10, 10, 10, 0.5)',
                border: '1px solid rgba(201, 169, 110, 0.2)',
                color: 'var(--color-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
              id="faq-search"
            />
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="pt-12 pb-20" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury max-w-5xl">
          {/* Category tabs */}
          {!isSearching && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = cat.id === activeCategory
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setOpenItem(null)
                    }}
                    className="inline-flex items-center gap-2 pl-5 pr-5 pt-2.5 pb-2.5 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                        : 'rgba(201, 169, 110, 0.06)',
                      color: isActive ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                      border: `1px solid ${isActive ? 'transparent' : 'rgba(201, 169, 110, 0.2)'}`,
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                    }}
                    id={`faq-tab-${cat.id}`}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {cat.title}
                  </button>
                )
              })}
            </div>
          )}

          {/* Category sections */}
          <div className="flex flex-col gap-12">
            {visibleCategories.length === 0 && (
              <motion.div
                className="text-center pt-12 pb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="body-lg mb-2" style={{ color: 'var(--color-ivory)' }}>
                  No matching questions found.
                </p>
                <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                  Try a different keyword, or{' '}
                  <Link to="/contact" className="hover:underline" style={{ color: 'var(--color-gold)' }}>
                    speak with our concierge
                  </Link>
                  .
                </p>
              </motion.div>
            )}

            {visibleCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.id}
                  id={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(201, 169, 110, 0.1)',
                        border: '1px solid rgba(201, 169, 110, 0.25)',
                      }}
                    >
                      <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <h2
                      className="heading-sm"
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                    >
                      {cat.title}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {cat.items.map((item, idx) => {
                      const itemId = `${cat.id}-${idx}`
                      return (
                        <FAQItem
                          key={itemId}
                          id={itemId}
                          q={item.q}
                          a={item.a}
                          isOpen={openItem === itemId}
                          onToggle={() => setOpenItem(openItem === itemId ? null : itemId)}
                        />
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Still need help */}
          <motion.div
            className="glass-gold rounded-2xl p-8 md:p-10 mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'rgba(201, 169, 110, 0.1)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
              }}
            >
              <MessageCircle size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
            </div>
            <h3
              className="heading-sm mb-3"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Still need help?
            </h3>
            <p className="body-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--color-ivory-muted)' }}>
              Our concierges are available to assist you with any inquiries.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 pl-7 pr-7 pt-3 pb-3 rounded-full text-xs tracking-[0.15em] uppercase font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                color: 'var(--color-obsidian)',
                fontFamily: 'var(--font-sans)',
              }}
              id="faq-contact-cta"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
