import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageTransition } from '@/animations/variants'
import { useEffect } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getLenis } from '@/hooks/useLenis'

export default function PageWrapper({ children }) {
  const location = useLocation()
  const progress = useScrollProgress()

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

    // Defer the nudge to the next frame so the new route has mounted, then
    // bounce back to 0 on the frame after that. The user perceives no motion
    // but the browser is forced to reflow and any in-view observers fire.
    const raf1 = requestAnimationFrame(() => {
      const l = getLenis()
      if (l) l.scrollTo(1, { immediate: true, force: true })
      else window.scrollTo(0, 1)

      const raf2 = requestAnimationFrame(() => {
        const l2 = getLenis()
        if (l2) l2.scrollTo(0, { immediate: true, force: true })
        else window.scrollTo(0, 0)
      })

      // Stash the inner raf id on the closure variable so we can cancel both.
      // (using a ref-like pattern via closure capture)
      cleanup.inner = raf2
    })

    const cleanup = { outer: raf1, inner: 0 }
    return () => {
      cancelAnimationFrame(cleanup.outer)
      if (cleanup.inner) cancelAnimationFrame(cleanup.inner)
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
