import { Gem, CalendarDays, ShoppingBag, Shirt, HeartHandshake } from 'lucide-react'

const PILLARS = [
  {
    icon: Gem,
    title: 'WEAR LUXURY',
    subtitle: 'Without buying',
  },
  {
    icon: CalendarDays,
    title: 'IDEAL FOR EVERY OCCASION',
    subtitle: 'Weddings, parties & more',
  },
  {
    icon: ShoppingBag,
    title: 'ACCESS MORE LOOKS',
    subtitle: 'For less',
  },
  {
    icon: Shirt,
    title: 'AVOID REPEATING OUTFITS',
    subtitle: 'Always look new',
  },
  {
    icon: HeartHandshake,
    title: 'HASSLE-FREE & CONVENIENT',
    subtitle: 'We handle the rest',
  },
]

export default function WhyRentSection() {
  return (
    <section className="w-full bg-[#08090A] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-[0.2em] text-[#C9A96E] uppercase">
            WHY RENT?
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A96E]/50" />
            <span className="w-1.5 h-1.5 rotate-45 border border-[#C9A96E]" />
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A96E]/50" />
          </div>
        </div>

        {/* 5 Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-4 rounded-sm transition-transform duration-300 hover:-translate-y-1 ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.25)] shadow-[0_0_15px_rgba(201,169,110,0.08)]">
                  <Icon className="w-5 h-5 text-[#C9A96E]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-semibold tracking-[0.14em] text-[#FAF6F0] uppercase font-sans mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#FAF6F0]/65 font-sans font-light">
                  {pillar.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
