import { useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Extract product ID from a product page URL path.
 * e.g. "/product/barbie-3d-ball-gown-2394" → 2394
 * Returns null for non-product pages.
 */
function extractProductIdFromPath(pathname) {
  if (!pathname.startsWith('/product/')) return null
  const match = pathname.match(/-(\d+)$/)
  return match ? Number(match[1]) : null
}

/**
 * Detect the page type from the pathname.
 */
function detectPageType(pathname) {
  if (pathname.startsWith('/product/')) return 'product_view'
  if (pathname.startsWith('/jewellery')) return 'category_view'
  if (pathname.startsWith('/bridal')) return 'category_view'
  if (pathname.startsWith('/shop')) return 'shop_view'
  if (pathname.startsWith('/cart')) return 'cart_view'
  if (pathname.startsWith('/checkout')) return 'checkout_start'
  return 'page_view'
}

export function useAnalytics() {
  const location = useLocation()
  // Guard against duplicate fires for the same path (React StrictMode / AnimatePresence)
  const lastTrackedPath = useRef(null)

  const trackEvent = useCallback(async (eventType, data = {}) => {
    try {
      const payload = {
        eventType,
        pagePath: location.pathname + location.search,
        targetId: data.targetId || null,
        targetType: data.targetType || null,
        metadata: data.metadata || null,
      }

      await fetch('/API/v1/track-event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      // Fire and forget — don't block UI
    }
  }, [location.pathname, location.search])

  // Auto-track page view on path changes — fires ONCE per unique path
  useEffect(() => {
    const currentPath = location.pathname + location.search
    if (lastTrackedPath.current === currentPath) return // already tracked this path
    lastTrackedPath.current = currentPath

    const timer = setTimeout(() => {
      const pageType = detectPageType(location.pathname)
      const productId = extractProductIdFromPath(location.pathname)

      trackEvent(pageType, {
        targetId: productId,
        targetType: productId ? (location.pathname.includes('/bridal') ? 'garments' : 'jewellery') : null,
      })
    }, 150)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search, trackEvent])

  return { trackEvent }
}
