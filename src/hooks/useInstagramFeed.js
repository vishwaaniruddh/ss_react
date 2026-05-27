import { useEffect, useRef, useState } from 'react'
import { getInstagramFeed } from '@/utils/api'

/**
 * Fetch the public Instagram feed for the configured profile via the
 * server-side proxy.
 *
 * @returns {{
 *   data: object|null,
 *   posts: object[],
 *   isLoading: boolean,
 *   error: Error|null,
 *   refetch: () => void,
 * }}
 */
export default function useInstagramFeed() {
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

    getInstagramFeed({ signal: controller.signal })
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
    posts: data?.posts || [],
    profileUrl: data?.profile_url || 'https://www.instagram.com/flyrobe_srishringarr/',
    isLoading,
    error,
    refetch: () => setRefreshKey((k) => k + 1),
  }
}
