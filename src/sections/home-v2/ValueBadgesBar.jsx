import { Shirt, Gem, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react'

const BADGES = [
  {
    icon: Shirt,
    title: 'RENTAL OUTFITS',
    subtitle: 'Designer wear on rent',
  },
  {
    icon: Gem,
    title: 'RENTAL JEWELLERY',
    subtitle: 'Luxury jewellery collection',
  },
  {
    icon: Sparkles,
    title: 'STYLING ASSISTANCE',
    subtitle: 'Personalised for you',
  },
  {
    icon: ShieldCheck,
    title: 'HYGIENE MAINTAINED',
    subtitle: 'Professionally cleaned',
  },
  {
    icon: HeartHandshake,
    title: 'PRE-LOVED PIECES',
    subtitle: 'Sustainable & stylish',
  },
]

export default function ValueBadgesBar() {
  return (
    <section className="w-full bg-[#0B0D0E] border-b border-[rgba(201,169,110,0.15)] py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-[rgba(201,169,110,0.12)]">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center px-3 pt-3 sm:pt-0 ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)]">
                  <Icon className="w-5 h-5 text-[#C9A96E]" strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-semibold tracking-[0.15em] text-[#C9A96E] uppercase font-sans mb-0.5">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#FAF6F0]/65 font-sans font-light">
                  {badge.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
