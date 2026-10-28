import { Shirt, Recycle, Leaf, RefreshCw } from 'lucide-react'

const SUSTAINABLE_PILLARS = [
  {
    icon: Shirt,
    title: 'EXTENDS GARMENT LIFE',
    subtitle: 'Gives new life to beautiful outfits',
  },
  {
    icon: Recycle,
    title: 'REDUCES WASTE',
    subtitle: 'Less production. Less waste.',
  },
  {
    icon: Leaf,
    title: 'SUPPORTS CONSCIOUS FASHION',
    subtitle: 'A thoughtful choice for the planet',
  },
  {
    icon: RefreshCw,
    title: 'BEAUTIFUL FASHION, IN A CIRCULAR WAY',
    subtitle: 'Rent. Reuse. Restyle. Repeat.',
  },
]

export default function FashionThatCaresSection() {
  return (
    <section className="w-full bg-[#08090A] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-[0.16em] text-[#C9A96E] uppercase">
            FASHION THAT CARES
          </h2>
          <p className="text-sm text-[#FAF6F0]/75 font-sans font-light">
            Sustainable choices for a beautiful tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 4 Sustainability Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUSTAINABLE_PILLARS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-3 rounded-sm group hover:-translate-y-1 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.2)] group-hover:border-[#C9A96E] transition-colors">
                      <Icon className="w-5 h-5 text-[#C9A96E]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[11px] font-semibold tracking-[0.12em] text-[#FAF6F0] uppercase font-sans mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#FAF6F0]/60 font-sans font-light">
                      {item.subtitle}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Editorial Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border border-[rgba(201,169,110,0.25)] group">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                alt="Conscious Circular Fashion Model"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/banner/banner1.webp'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090A]/80 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
