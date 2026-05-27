import { motion } from 'framer-motion'

export default function SplitText({
  children,
  className = '',
  type = 'words', // 'chars' | 'words' | 'lines'
  stagger = 0.03,
  delay = 0,
  duration = 0.6,
  as: Component = 'div',
  style = {},
}) {
  if (!children || typeof children !== 'string') return null

  const elements = type === 'chars'
    ? children.split('')
    : type === 'words'
    ? children.split(' ')
    : children.split('\n')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <Component
      className={className}
      style={{ ...style, perspective: '800px' }}
    >
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{ display: 'block' }}
      >
        {elements.map((el, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            style={{
              display: 'inline-block',
              transformOrigin: 'bottom',
              willChange: 'transform, opacity',
            }}
          >
            {el}
            {type === 'words' && i < elements.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  )
}
