import { Link } from 'react-router-dom'

export default function FooterV2() {
  return (
    <footer className="w-full bg-[#060708] border-t border-[rgba(201,169,110,0.2)] text-[#FAF6F0] pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-[rgba(201,169,110,0.12)]">
          
          {/* Brand Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/home-2" className="block">
              <span className="text-xl sm:text-2xl font-serif text-[#C9A96E] tracking-[0.1em] block uppercase">
                Sri Shringarr
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#FAF6F0]/60 uppercase block font-sans -mt-0.5">
                FASHION STUDIO
              </span>
            </Link>
            <p className="text-xs text-[#FAF6F0]/60 font-sans font-light leading-relaxed max-w-xs">
              Premium designer outfits &amp; jewellery on rent since 2009. Luxury. Variety. Responsibility.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-7 h-7 rounded-full border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
              >
                <span className="text-[11px] font-serif font-bold leading-none">P</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-full border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links: RENT (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              RENT
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/70 font-sans font-light">
              <li><Link to="/shop?category=outfits" className="hover:text-[#C9A96E] transition-colors">Rent Outfits</Link></li>
              <li><Link to="/jewellery" className="hover:text-[#C9A96E] transition-colors">Rent Jewellery</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#C9A96E] transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-[#C9A96E] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Links: COLLECTIONS (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/70 font-sans font-light">
              <li><Link to="/bridal/lehenga" className="hover:text-[#C9A96E] transition-colors">Lehengas</Link></li>
              <li><Link to="/bridal/gown" className="hover:text-[#C9A96E] transition-colors">Gowns</Link></li>
              <li><Link to="/bridal/saree" className="hover:text-[#C9A96E] transition-colors">Sarees</Link></li>
              <li><Link to="/jewellery" className="hover:text-[#C9A96E] transition-colors">Jewellery</Link></li>
            </ul>
          </div>

          {/* Links: PRE-LOVED (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              PRE-LOVED
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/70 font-sans font-light">
              <li><Link to="/shop?category=pre-loved" className="hover:text-[#C9A96E] transition-colors">Shop Pre-Loved</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#C9A96E] transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-[#C9A96E] transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Links: CUSTOM DESIGN (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              CUSTOM DESIGN
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/70 font-sans font-light">
              <li><Link to="/contact?service=bespoke" className="hover:text-[#C9A96E] transition-colors">Bespoke Outfits</Link></li>
              <li><Link to="/about" className="hover:text-[#C9A96E] transition-colors">Process</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9A96E] transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Links: HELP (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              HELP
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/70 font-sans font-light">
              <li><Link to="/faq" className="hover:text-[#C9A96E] transition-colors">FAQ</Link></li>
              <li><Link to="/terms#care" className="hover:text-[#C9A96E] transition-colors">Care &amp; Hygiene</Link></li>
              <li><Link to="/terms#delivery" className="hover:text-[#C9A96E] transition-colors">Delivery &amp; Returns</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9A96E] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* VISIT US & CONTACT (1.5 cols) */}
          <div className="lg:col-span-1.5 space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans">
              VISIT US
            </h4>
            <p className="text-[11px] text-[#FAF6F0]/60 font-sans">
              Find a store near you
            </p>
            <Link
              to="/contact"
              className="inline-block px-3 py-1.5 border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0A0A0A] text-[10px] font-medium tracking-[0.15em] uppercase transition-all"
            >
              STORE LOCATOR
            </Link>
            <div className="pt-2 space-y-0.5">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF6F0]/50 block">
                WHATSAPP
              </span>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#C9A96E] font-medium hover:underline block"
              >
                +91 98765 43210
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF6F0]/50 font-sans gap-3">
          <p>© 2009 - 2026 Sri Shringarr Fashion Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-[#C9A96E] transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-[#C9A96E] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
