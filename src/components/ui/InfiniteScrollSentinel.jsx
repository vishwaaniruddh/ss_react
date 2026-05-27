import { useEffect, useRef } from 'react'

/**
 * Sentinel — a tiny invisible div placed below the product grid that fires
 * `onIntersect` once it scrolls into view. Used to drive infinite scroll on
 * listing pages.
 *
 * The `rootMargin` defaults to `400px 0px` so the next page begins loading
 * before the user actually reaches the bottom — avoids the "blink" between
 * pages and gives Lenis-smoothed scrolling enough lead time.
 *
 * Pass `disabled` to suspend observation (e.g. when there's no more data,
 * the initial fetch is in flight, or an error is being shown).
 */
export default function InfiniteScrollSentinel({
  onIntersect,
  disabled = false,
  rootMargin = '400px 0px',
  className = '',
  ariaLabel = 'Loading more',
}) {
  const ref = useRef(null)
  const callbackRef = useRef(onIntersect)

  // Always invoke the latest handler without re-creating the observer on each
  // render — important when the parent passes an inline arrow function.
  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    if (disabled) return undefined
    const node = ref.current
    if (!node) return undefined

    // IntersectionObserver isn't universally available (SSR or older test
    // envs); fall back gracefully — pagination just won't auto-trigger and
    // the page stays usable.
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbackRef.current?.()
          }
        }
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [disabled, rootMargin])

  return (
    <div
      ref={ref}
      aria-hidden={disabled || undefined}
      aria-label={ariaLabel}
      className={className}
      style={{ height: 1, width: '100%' }}
    />
  )
}
