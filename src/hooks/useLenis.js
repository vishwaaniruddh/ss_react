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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis
    lenisInstance = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])

  return lenisRef
}
