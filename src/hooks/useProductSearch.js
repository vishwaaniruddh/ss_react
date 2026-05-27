import { useEffect, useRef, useState } from 'react'
import { searchProducts } from '@/utils/api'

/**
 * Debounced product search hook.
 *
 * Waits `debounceMs` after the user stops typing before firing a request,
 * cancels in-flight fetches when the query changes, and ignores results
 * from stale queries even after the new one has cancelled them.
 *
 * @param {object}   options
 * @param {string}   options.query
 * @param {number=}  options.limit         default 8
 * @param {number=}  options.debounceMs    default 250
 * @param {boolean=} options.enabled       skip the fetch entirely (e.g. closed overlay)
 *
 * @returns {{
 *   items: object[],
 *   pagination: object|null,
 *   isLoading: boolean,
 *   error: Error|null,
 * }}
 */
export default function useProductSearch({
  query,
  limit = 8,
  debounceMs = 250,
  enabled = true,
} = {}) {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const controllerRef = useRef(null)

  useEffect(() => {
    const trimmed = (query || '').trim()

    // No query → no fetch, clear out previous results.
    if (!enabled || !trimmed) {
      controllerRef.current?.abort()
      setItems([])
      setPagination(null)
      setIsLoading(false)
      setError(null)
      return undefined
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    // Debounce so we don't hammer the API on every keystroke.
    const debounceTimer = setTimeout(() => {
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      searchProducts({ query: trimmed, limit, signal: controller.signal })
        .then((result) => {
          if (cancelled) return
          setItems(result.items)
          setPagination(result.pagination)
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return
          setError(err)
          setItems([])
          setPagination(null)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, debounceMs)

    return () => {
      cancelled = true
      clearTimeout(debounceTimer)
      controllerRef.current?.abort()
    }
  }, [query, limit, debounceMs, enabled])

  return { items, pagination, isLoading, error }
}
