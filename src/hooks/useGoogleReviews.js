import { useEffect, useRef, useState } from 'react'
import { getGoogleReviews } from '@/utils/api'

/**
 * Fetch Google Places reviews via the server-side proxy.
 *
 * @returns {{
 *   data: object|null,        // normalized payload from the server
 *   reviews: object[],        // shortcut to data.reviews (always an array)
 *   isLoading: boolean,
 *   error: Error|null,
 *   refetch: () => void,
 * }}
 */
export default function useGoogleReviews() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const controllerRef = useRef(null)

  useEffect(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    let cancelled = false
    setIsLoading(true)
    setError(null)

    getGoogleReviews({ signal: controller.signal })
      .then((payload) => {
        if (cancelled) return
        setData(payload)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setError(err)
        setData(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [refreshKey])

  return {
    data,
    reviews: data?.reviews || [],
    isLoading,
    error,
    refetch: () => setRefreshKey((k) => k + 1),
  }
}
