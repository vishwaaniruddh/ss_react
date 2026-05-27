import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createMagneticEffect } from '@/animations/gsapUtils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  magnetic = true,
  className = '',
  ...props
}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (magnetic && !prefersReducedMotion && ref.current) {
      const cleanup = createMagneticEffect(ref.current, 0.25)
      return cleanup
    }
  }, [magnetic, prefersReducedMotion])

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden',
  }

  const sizeStyles = {
    sm: { fontSize: '0.7rem', padding: '0.625rem 1.5rem' },
    md: { fontSize: '0.75rem', padding: '0.875rem 2.25rem' },
    lg: { fontSize: '0.8rem', padding: '1.125rem 3rem' },
  }

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
      color: 'var(--color-obsidian)',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-gold)',
      border: '1px solid var(--color-gold)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-ivory)',
      border: '1px solid rgba(245, 240, 232, 0.2)',
    },
    white: {
      background: 'var(--color-ivory)',
      color: 'var(--color-obsidian)',
      border: 'none',
    },
  }

  const combinedStyle = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  const Component = to ? Link : href ? 'a' : 'button'
  const linkProps = to ? { to } : href ? { href } : {}

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Component
        style={combinedStyle}
        className="group"
        {...linkProps}
        {...props}
        onMouseEnter={(e) => {
          if (variant === 'secondary') {
            e.currentTarget.style.background = 'var(--color-gold)'
            e.currentTarget.style.color = 'var(--color-obsidian)'
          }
          if (variant === 'ghost') {
            e.currentTarget.style.borderColor = 'var(--color-ivory)'
            e.currentTarget.style.background = 'rgba(245, 240, 232, 0.05)'
          }
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (variant === 'secondary') {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--color-gold)'
          }
          if (variant === 'ghost') {
            e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)'
            e.currentTarget.style.background = 'transparent'
          }
          props.onMouseLeave?.(e)
        }}
      >
        {children}
      </Component>
    </motion.div>
  )
}
