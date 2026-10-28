import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function HeroV2() {
  return (
    <section className="relative w-full bg-[#08090a] overflow-hidden border-b border-[rgba(201,169,110,0.15)]">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Bridal Image */}
          <div className="lg:col-span-6 relative flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[520px] aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border border-[rgba(201,169,110,0.25)] group">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
                alt="Sri Shringarr Bridal Luxury Heritage Collection"
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/banner/banner1.webp'
                }}
              />
              {/* Subtle inner gold vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 border border-[rgba(201,169,110,0.15)] pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2 space-y-6 lg:space-y-8">
            {/* Since 2009 Tag with Gold Filigree */}
            <div className="inline-flex items-center gap-3 text-xs tracking-[0.35em] text-[#C9A96E] uppercase font-serif">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C9A96E]" />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                SINCE 2009
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C9A96E]" />
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-[#C9A96E] uppercase tracking-wide leading-[1.1]">
                RENT THE LOOK.
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-[#FAF6F0] uppercase tracking-wide leading-[1.1]">
                OWN THE MOMENT.
              </h2>
            </div>

            {/* Subtitles */}
            <div className="space-y-2 max-w-xl">
              <p className="text-base sm:text-lg text-[#FAF6F0]/80 font-serif tracking-wide">
                Designer outfits &amp; jewellery on rent since 2009.
              </p>
              <p className="text-sm sm:text-base text-[#C9A96E]/90 tracking-[0.2em] uppercase font-sans font-light">
                Luxury. Variety. Responsibility.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                to="/shop?category=outfits"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C9A96E] hover:bg-[#D4B87A] text-[#0A0A0A] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(201,169,110,0.4)] text-center cursor-pointer"
              >
                RENT OUTFITS
              </Link>
              
              <Link
                to="/jewellery"
                className="w-full sm:w-auto px-8 py-3.5 border border-[#C9A96E] hover:bg-[#C9A96E]/10 text-[#C9A96E] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 text-center cursor-pointer"
              >
                RENT JEWELLERY
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
