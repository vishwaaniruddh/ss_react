import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  MapPin, Phone, Mail, Clock, Send, MessageCircle,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'

const STUDIO_ADDRESS_LINES = [
  'Shyamkamal Building B/1, Office No. 104,',
  '1st Floor, Agarwal Market,',
  'Opposite Railway Station,',
  'Vile Parle (East), Mumbai 400 057',
]

const PHONES = [
  { display: '+91 93242 43011', tel: '+919324243011' },
  { display: '+91 74004 13163', tel: '+917400413163' },
]

const EMAIL = 'hello@srishringarr.com'

const SUBJECTS = [
  'Bridal Consultation',
  'Jewellery Rental Enquiry',
  'Custom / Bespoke Order',
  'Existing Order Support',
  'Press & Collaborations',
  'Other',
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/flyrobe_srishringarr/',
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/srishringarr/',
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://in.pinterest.com/srishringarr/',
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 11.5c0-2.5 2-4.5 4.5-4.5S17 9 17 11.5c0 2-1.5 3.5-3.5 3.5-1 0-1.8-.5-2-1.2" />
        <path d="M11.5 9.5L9.5 19" />
      </svg>
    ),
  },
]

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sri+Shringarr+Fashion+Studio+Vile+Parle+East+Mumbai'

const MAPS_EMBED =
  'https://www.google.com/maps?q=Vile+Parle+East+Railway+Station+Mumbai&output=embed'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: SUBJECTS[0],
        message: '',
      })
    }, 2500)
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const inputStyle = {
    background: 'rgba(10, 10, 10, 0.4)',
    border: '1px solid rgba(201, 169, 110, 0.18)',
    color: 'var(--color-ivory)',
    fontFamily: 'var(--font-sans)',
  }

  const labelClass =
    'block text-xs tracking-[0.18em] uppercase mb-2'
  const labelStyle = {
    color: 'var(--color-gold)',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Sri Shringarr Fashion Studio. Visit our Vile Parle (East) atelier, call our concierge, or book a private consultation."
      />

      {/* Hero */}
      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="text-center mb-14">
            <motion.p
              className="label-text mb-4"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              Get in Touch
            </motion.p>
            <SplitText
              className="heading-xl mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Speak with Our Concierge
            </SplitText>
            <motion.p
              className="body-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-ivory-muted)' }}
              {...fadeInUp}
            >
              Visit our Mumbai atelier, book a private consultation, or simply share your
              vision — our concierge team will respond with the care every patron deserves.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Contact info */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Visit Us */}
              <motion.a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItem}
                className="glass-gold rounded-2xl p-6 flex gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10"
                id="contact-card-visit"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(201, 169, 110, 0.12)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <MapPin size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Visit Our Atelier
                  </p>
                  <p
                    className="body-sm font-medium mb-1"
                    style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-serif)' }}
                  >
                    Sri Shringarr Fashion Studio
                  </p>
                  <address
                    className="not-italic body-sm space-y-0.5"
                    style={{ color: 'var(--color-ivory-muted)' }}
                  >
                    {STUDIO_ADDRESS_LINES.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                  <span
                    className="inline-block mt-3 text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Get Directions →
                  </span>
                </div>
              </motion.a>

              {/* Call us */}
              <motion.div
                variants={staggerItem}
                className="glass-gold rounded-2xl p-6 flex gap-4"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(201, 169, 110, 0.12)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Phone size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Call Us
                  </p>
                  <div className="flex flex-col gap-1">
                    {PHONES.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="body-sm transition-colors duration-300 hover:text-gold"
                        style={{ color: 'var(--color-ivory)' }}
                      >
                        {p.display}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.a
                href={`mailto:${EMAIL}`}
                variants={staggerItem}
                className="glass-gold rounded-2xl p-6 flex gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(201, 169, 110, 0.12)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Mail size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Email Us
                  </p>
                  <p className="body-sm" style={{ color: 'var(--color-ivory)' }}>
                    {EMAIL}
                  </p>
                </div>
              </motion.a>

              {/* Hours */}
              <motion.div
                variants={staggerItem}
                className="glass-gold rounded-2xl p-6 flex gap-4"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(201, 169, 110, 0.12)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Clock size={20} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Studio Hours
                  </p>
                  <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                    Mon – Sat: 11:00 AM – 8:00 PM
                  </p>
                  <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
                    Sunday: By Appointment
                  </p>
                </div>
              </motion.div>

              {/* Socials */}
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-3 pt-2"
              >
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: 'var(--color-ivory-muted)' }}
                >
                  Follow
                </span>
                <span className="w-8 h-px bg-gold/20" />
                {SOCIALS.map(({ label, href, svg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border border-gold/20 hover:bg-gold hover:text-obsidian hover:border-gold"
                    style={{ color: 'var(--color-ivory-muted)' }}
                  >
                    {svg}
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.form
              className="lg:col-span-3 glass-gold rounded-2xl p-8 lg:p-10"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              id="contact-form"
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(201, 169, 110, 0.1)',
                    border: '1px solid rgba(201, 169, 110, 0.25)',
                  }}
                >
                  <MessageCircle
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: 'var(--color-gold)' }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Send a Message
                  </p>
                  <h2
                    className="heading-sm"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    Tell Us About Your Occasion
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="contact-name">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="contact-phone">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="contact-subject">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50 cursor-pointer"
                    style={inputStyle}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} style={{ background: 'var(--color-charcoal)' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass} style={labelStyle} htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share your event details, dates, and what you have in mind…"
                  className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
                  style={inputStyle}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" id="contact-submit">
                {submitted ? (
                  '✓ Message Sent — We will be in touch'
                ) : (
                  <>
                    <Send size={14} /> Send Message
                  </>
                )}
              </Button>

              <p
                className="text-xs tracking-[0.05em] mt-5"
                style={{ color: 'rgba(245, 240, 232, 0.4)' }}
              >
                We respect your privacy. Your details are used only to respond to your enquiry.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pt-0 pb-20" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(201, 169, 110, 0.18)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <iframe
              title="Sri Shringarr Fashion Studio — Vile Parle East, Mumbai"
              src={MAPS_EMBED}
              width="100%"
              height="420"
              style={{ border: 0, display: 'block', filter: 'grayscale(0.2) contrast(1.05)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
