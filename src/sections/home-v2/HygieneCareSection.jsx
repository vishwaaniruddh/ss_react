import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

const HYGIENE_POINTS = [
  'Professionally dry cleaned after every use',
  'Steam sanitised for complete freshness',
  'Carefully quality checked',
  'Well-maintained garments & jewellery',
  'Packed with care & delivered hygienically',
]

export default function HygieneCareSection() {
  return (
    <section className="w-full bg-[#0B0D0E] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Sanitization Studio Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3.5] rounded-sm overflow-hidden shadow-2xl border border-[rgba(201,169,110,0.25)] group">
              <img
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop"
                alt="Hygiene and Professional Garment Care"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/banner/banner1.webp'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E]/80 via-transparent to-black/20" />
            </div>
          </div>

          {/* Right: Content & Circular Seal */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-[0.14em] text-[#C9A96E] uppercase">
                  HYGIENE &amp; CARE
                </h2>
                <p className="text-sm text-[#FAF6F0]/75 font-sans font-light mt-1">
                  Your safety. Our priority.
                </p>
              </div>

              <ul className="space-y-3 pt-2">
                {HYGIENE_POINTS.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-left">
                    <div className="w-5 h-5 rounded-full bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]" strokeWidth={2} />
                    </div>
                    <span className="text-xs sm:text-sm text-[#FAF6F0]/85 font-sans font-light">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Circular Gold Seal Emblem */}
            <div className="flex-shrink-0 flex items-center justify-center pt-2 sm:pt-4">
              <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-[#C9A96E]/50 flex items-center justify-center p-2 bg-[#090A0B] shadow-[0_0_30px_rgba(201,169,110,0.15)] group hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full border border-[#C9A96E] flex flex-col items-center justify-center p-2 text-center">
                  <ShieldCheck className="w-6 h-6 text-[#C9A96E] mb-1" strokeWidth={1.5} />
                  <span className="text-[8px] font-bold tracking-[0.18em] text-[#C9A96E] uppercase leading-tight font-sans">
                    PROFESSIONALLY<br />CLEANED
                  </span>
                  <span className="text-[7px] text-[#FAF6F0]/60 tracking-[0.15em] uppercase mt-0.5">
                    HYGIENE PROMISE
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
