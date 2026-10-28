import { useEffect, useRef } from 'react'

// Module-level singleton so other code (route change handlers, anchor
// links, etc.) can reach the active Lenis instance without prop drilling.
let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Only load and initialize Lenis on desktop (viewport >= 1024px)
    // Dynamic import ensures mobile browsers never download or parse Lenis code
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    let isMounted = true
    let initiated = false

    function init() {
      if (initiated || !isMounted) return
      initiated = true

      import('lenis').then(({ default: Lenis }) => {
        if (!isMounted) return

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
          if (!lenisRef.current) return
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      })
    }

    // Trigger on first user scroll / wheel / pointer interaction, or idle timeout
    const events = ['scroll', 'wheel', 'pointerdown', 'keydown']
    events.forEach((ev) => window.addEventListener(ev, init, { once: true, passive: true }))

    const idleTimer = setTimeout(init, 4000)

    return () => {
      isMounted = false
      clearTimeout(idleTimer)
      events.forEach((ev) => window.removeEventListener(ev, init))
      if (lenisRef.current) {
        lenisRef.current.destroy()
        if (lenisInstance === lenisRef.current) lenisInstance = null
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}
