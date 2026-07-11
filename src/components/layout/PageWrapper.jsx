import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageTransition } from '@/animations/variants'
import { useEffect } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getLenis } from '@/hooks/useLenis'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function PageWrapper({ children }) {
  const location = useLocation()
  const progress = useScrollProgress()
  
  // Initialize automatic page view tracking
  useAnalytics()

  // Scroll to top on route change
  //
  // Lenis hijacks window.scrollTo, so we drive the scroll through the active
  // instance with `immediate: true` to land at the top instantly. Falling
  // back to the native APIs covers the brief window before Lenis mounts.
  //
  // We also nudge the scroll by 1px after the next frame to force layout
  // engines (and IntersectionObserver) to recompute — without this, some
  // pages render content below the fold until the user manually scrolls.
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Defer a 1px scroll down to allow full layout mounting, transition completion, and hydration.
    // We execute this at 700ms (after the 600ms page entry transition finishes) and 1200ms
    // to force layout, IntersectionObservers, and ScrollTriggers to recalculate.
    const triggerNudge = () => {
      const l = getLenis()
      if (l) {
        l.resize()
        l.scrollTo(1, { immediate: true, force: true })
        window.dispatchEvent(new Event('scroll'))
      } else {
        window.scrollTo(0, 1)
        window.dispatchEvent(new Event('scroll'))
      }
    }

    const timer1 = setTimeout(triggerNudge, 700)
    const timer2 = setTimeout(triggerNudge, 1200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [location.pathname])

  return (
    <>
      {/* Scroll progress indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
        style={{ background: 'transparent' }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))',
            scaleX: progress,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full flex-1 flex flex-col"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  )
}
