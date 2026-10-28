import { Link } from 'react-router-dom'

export default function CustomDesignedSection() {
  return (
    <section className="w-full bg-[#0A0C0D] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left: Fashion Sketch Image */}
          <div className="lg:col-span-4 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-sm overflow-hidden shadow-xl border border-[rgba(201,169,110,0.2)] group">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                alt="Custom Outfit Sketches & Atelier"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = '/banner/banner1.webp'
                }}
              />
              <div className="absolute inset-0 bg-[#0A0C0D]/30" />
            </div>
          </div>

          {/* Center: Content & CTA */}
          <div className="lg:col-span-4 text-center space-y-3 order-1 lg:order-2 px-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif tracking-[0.14em] text-[#C9A96E] uppercase leading-tight">
              CUSTOM DESIGNED OUTFITS
            </h2>
            <p className="text-sm sm:text-base font-serif italic text-[#FAF6F0]/90">
              Dream it. We design it.
            </p>
            <p className="text-xs text-[#FAF6F0]/65 font-sans font-light">
              Bespoke creations tailored just for you.
            </p>
            <div className="pt-3">
              <Link
                to="/contact?service=custom-design"
                className="inline-block px-6 py-2.5 border border-[#C9A96E] hover:bg-[#C9A96E] text-[#C9A96E] hover:text-[#0A0A0A] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-md cursor-pointer"
              >
                EXPLORE CUSTOM DESIGN
              </Link>
            </div>
          </div>

          {/* Right: Bespoke Creation Bride Image */}
          <div className="lg:col-span-4 flex justify-center order-3">
            <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-sm overflow-hidden shadow-xl border border-[rgba(201,169,110,0.2)] group">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
                alt="Bespoke Couture Creation"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = '/banner/banner1.webp'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0D]/60 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
