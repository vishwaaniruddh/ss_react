/* Framer Motion animation variants for Sri Shringaar */

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Fade in from below
export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Fade in from above
export const fadeInDown = {
  initial: { opacity: 0, y: -40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Fade in from left
export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Fade in from right
export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Scale in
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Staggered children
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
}

// Stagger item
export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Card hover
export const cardHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Image zoom
export const imageZoom = {
  rest: { scale: 1 },
  hover: {
    scale: 1.08,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Gold line reveal
export const lineReveal = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Letter-by-letter text reveal
export const letterReveal = {
  initial: { opacity: 0, y: 50 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.03,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

// Navbar variants
export const navbarVariants = {
  top: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backdropFilter: 'blur(0px)',
  },
  scrolled: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backdropFilter: 'blur(0px)',
  },
}

// Mobile menu
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Modal overlay
export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Scroll-triggered viewport detection
export const viewportOnce = {
  once: true,
  margin: '-80px',
  amount: 0.2,
}
