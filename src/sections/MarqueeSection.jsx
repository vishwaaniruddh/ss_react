import Marquee from '@/components/ui/Marquee'
import { MARQUEE_ITEMS } from '@/utils/constants'

export default function MarqueeSection() {
  return (
    <section
      className="pt-12 pb-12 lg:pt-16 lg:pb-16 overflow-hidden"
      style={{
        background: 'var(--color-obsidian)',
        borderTop: '1px solid rgba(201, 169, 110, 0.08)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.08)',
      }}
      id="marquee-section"
      aria-label="Brand Marquee"
    >
      <Marquee speed={35} className="mb-6">
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={i}
            className={`${item === '✦' ? 'text-lg ml-4 mr-4' : 'text-3xl lg:text-5xl font-light tracking-[0.05em]'}`}
            style={{
              fontFamily: item === '✦' ? 'inherit' : 'var(--font-display)',
              color: item === '✦' ? 'var(--color-gold)' : 'var(--color-ivory)',
              opacity: item === '✦' ? 1 : 0.15,
            }}
          >
            {item}
          </span>
        ))}
      </Marquee>

      <Marquee speed={40} direction="right">
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={`reverse-${i}`}
            className={`${item === '✦' ? 'text-lg ml-4 mr-4' : 'text-3xl lg:text-5xl font-light tracking-[0.05em]'}`}
            style={{
              fontFamily: item === '✦' ? 'inherit' : 'var(--font-display)',
              color: item === '✦' ? 'var(--color-gold)' : 'var(--color-ivory)',
              opacity: item === '✦' ? 1 : 0.08,
            }}
          >
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
