import { useEffect, useRef, useState } from 'react'
import { getProductById } from '@/utils/api'

/**
 * Fetch a single product by id (with optional name hint from the SEO slug).
 *
 * Cancels in-flight requests when the id changes so navigating between
 * product pages never produces stale state.
 *
 * @returns {{
 *   product: object|null,
 *   isLoading: boolean,
 *   error: Error|null,
 *   refetch: () => void,
 * }}
 */
export default function useProduct({ id, name, enabled = true } = {}) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(enabled && id != null))
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const controllerRef = useRef(null)

  useEffect(() => {
    if (!enabled || id == null) {
      setIsLoading(false)
      return undefined
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    let cancelled = false
    setIsLoading(true)
    setError(null)

    getProductById({ id, name, signal: controller.signal })
      .then((result) => {
        if (cancelled) return
        setProduct(result)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setError(err)
        setProduct(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [id, name, enabled, refreshKey])

  return {
    product,
    isLoading,
    error,
    refetch: () => setRefreshKey((k) => k + 1),
  }
}
