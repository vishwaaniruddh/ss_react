import { motion } from 'framer-motion'

export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}) {
  const items = Array.isArray(children) ? children : [children]
  const doubled = [...items, ...items]

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className={`flex whitespace-nowrap ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee ${speed}s linear infinite ${direction === 'right' ? 'reverse' : ''}`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 pl-4 pr-4"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
