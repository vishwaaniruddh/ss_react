import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

// Module-level singleton so other code (route change handlers, anchor
// links, etc.) can reach the active Lenis instance without prop drilling.
// Lenis hijacks window.scrollTo, so any "scroll to top on navigation" logic
// MUST go through this singleton or it will be ignored.
let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Defer Lenis init to after first paint to avoid blocking LCP
    // Only enable on desktop — mobile uses native scroll
    const isMobile = window.innerWidth < 1024
    if (isMobile) return // Skip Lenis entirely on mobile

    const timer = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
      })

      lenisRef.current = lenis
      lenisInstance = lenis

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (lenisRef.current) {
        lenisRef.current.destroy()
        if (lenisInstance === lenisRef.current) lenisInstance = null
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}
