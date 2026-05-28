import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/variants'
import { getLenis } from '@/hooks/useLenis'
import { useState } from 'react'
import { API_BASE_URL } from '@/utils/api'

const footerLinks = {
  Collections: [
    { label: 'Bridal Jewellery', path: '/collections/bridal-jewellery' },
    { label: 'Heritage Necklaces', path: '/collections/heritage-necklaces' },
    { label: 'Temple Jewellery', path: '/collections/temple-jewellery' },
    { label: 'Kundan & Polki', path: '/collections/kundan-polki' },
    { label: 'Diamond Collections', path: '/collections/diamond' },
  ],
  Services: [
    { label: 'How Rental Works', path: '/how-it-works' },
    { label: 'Shop', path: '/shop' },
    { label: 'Bridal Consultation', path: '/contact' },
    { label: 'Custom Orders', path: '/contact' },
  ],
  Support: [
    { label: 'FAQs', path: '/faq' },
    { label: 'Client Diary', path: '/client-diary' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Contact Us', path: '/contact' },
  ],
}

const socialLinks = [
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
    label: 'Twitter',
    href: 'https://twitter.com/SriShringarr',
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setSubmitting(true)
    try {
      const formData = new URLSearchParams()
      formData.append('email', email)
      const res = await fetch(`${API_BASE_URL}/subscribe.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setSubscribed(true)
        setEmail('')
        setTimeout(() => setSubscribed(false), 4000)
      } else {
        setError(data.message || 'Subscription failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative" style={{ background: 'var(--color-charcoal)' }}>
      <div className="luxury-divider" />

      {/* Newsletter */}
      <div className="container-luxury pt-14 pb-8">
        <motion.div
          className="glass rounded-2xl px-6 md:px-12 py-9 md:py-10 flex flex-col items-center text-center relative overflow-hidden border border-gold/15"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
        >
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          <div className="mb-4 flex justify-center items-center text-gold/80 gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" opacity="0.15" />
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
            style={{ color: 'var(--color-gold)' }}
          >
            Join the Inner Circle
          </p>
          <h3
            className="heading-sm mb-2 text-ivory"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Receive Exclusive Invitations
          </h3>
          <p className="text-[13px] max-w-md mb-5" style={{ color: 'var(--color-ivory-muted)' }}>
            Be the first to discover new collections, private events, and bespoke offerings.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10"
            id="newsletter-form"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none transition-all duration-300 border border-gold/20 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 text-ivory placeholder-ivory/40 bg-black/40"
              id="newsletter-email"
            />
            <motion.button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-500 cursor-pointer shadow-lg hover:shadow-gold/10 disabled:opacity-60"
              style={{
                background: subscribed
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                color: 'var(--color-obsidian)',
                fontFamily: 'var(--font-sans)',
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              id="newsletter-submit"
            >
              {submitting ? '...' : subscribed ? '✓ Subscribed' : 'Subscribe'}
            </motion.button>
          </form>
          {error && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>
          )}
          {subscribed && (
            <p className="text-xs mt-2" style={{ color: '#22c55e' }}>
              Check your inbox — we sent you a welcome email.
            </p>
          )}
        </motion.div>
      </div>

      <div className="luxury-divider" style={{ opacity: 0.2 }} />

      {/* Footer body */}
      <div className="container-luxury pt-14 pb-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Brand */}
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span
                className="text-lg tracking-[0.18em] block"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontWeight: 500 }}
              >
                SRI SHRINGARR
              </span>
              <span
                className="block text-[9px] tracking-[0.4em] uppercase mt-0.5"
                style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
              >
                Fashion Studio
              </span>
            </Link>

            <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'var(--color-ivory-muted)' }}>
              Elevating moments with heritage elegance and frictionless luxury.
            </p>

            <address
              className="not-italic text-[12px] leading-relaxed mb-4"
              style={{ color: 'var(--color-ivory-muted)' }}
            >
              Shyamkamal Building B/1, Office No. 104,<br />
              1st Floor, Agarwal Market,<br />
              Vile Parle (East), Mumbai 400 057
            </address>

            <div className="flex flex-col gap-1.5 mb-5">
              <a
                href="tel:+919324243011"
                className="inline-flex items-center gap-2 text-[12px] transition-colors duration-300 hover:text-gold"
                style={{ color: 'var(--color-ivory-muted)' }}
              >
                <Phone size={12} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                <span>+91 93242 43011</span>
              </a>
              <a
                href="mailto:hello@srishringarr.com"
                className="inline-flex items-center gap-2 text-[12px] transition-colors duration-300 hover:text-gold"
                style={{ color: 'var(--color-ivory-muted)' }}
              >
                <Mail size={12} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                <span>hello@srishringarr.com</span>
              </a>
            </div>

            <div className="flex gap-2">
              {socialLinks.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-gold/20 text-ivory/60 hover:bg-gold hover:text-obsidian hover:border-gold hover:-translate-y-0.5"
                  id={`footer-social-${label.toLowerCase()}`}
                >
                  {svg}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={staggerItem}>
              <h4
                className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-4"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-gold)' }}
              >
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-[13px] transition-all duration-300 hover:text-gold inline-block"
                      style={{ color: 'var(--color-ivory-muted)' }}
                      id={`footer-link-${link.label.toLowerCase().replace(/[\s&/]/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 mt-10 pt-5 text-center md:text-left"
          style={{ borderTop: '1px solid rgba(201, 169, 110, 0.12)' }}
        >
          <p
            className="text-[11px] tracking-[0.15em]"
            style={{ color: 'rgba(245, 240, 232, 0.55)', fontFamily: 'var(--font-sans)' }}
          >
            © {new Date().getFullYear()} Sri Shringarr Fashion Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span
              className="hidden md:inline-flex items-center gap-1.5 text-[11px]"
              style={{ color: 'rgba(245, 240, 232, 0.4)' }}
            >
              <MapPin size={11} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
              Mumbai, India
            </span>
            <button
              onClick={scrollToTop}
              className="text-[10px] tracking-[0.22em] uppercase text-gold hover:text-gold transition-colors duration-300 cursor-pointer border-b border-gold/40 pb-0.5 hover:border-gold"
              id="footer-back-to-top"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
