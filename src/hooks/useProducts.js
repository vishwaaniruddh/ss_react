import { useEffect, useRef, useState } from 'react'
import { getProducts } from '@/utils/api'

/**
 * Fetch the products listing with built-in cancellation.
 *
 * Re-runs whenever any of `category`, `page`, `minPrice`, `maxPrice`, or
 * `sort` changes. Previous in-flight requests are aborted, so rapid filter
 * toggling never produces stale results.
 *
 * @param {object} params  — see `getProducts` in @/utils/api
 * @returns {{
 *   items: object[],
 *   pagination: object|null,
 *   isLoading: boolean,
 *   error: Error|null,
 *   refetch: () => void,
 * }}
 */
export default function useProducts({
  category,
  type,
  search,
  page = 1,
  minPrice,
  maxPrice,
  sort = 'sku_desc',
  enabled = true,
} = {}) {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const controllerRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return undefined
    }

    // Cancel any previous request still in flight.
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    let cancelled = false
    setIsLoading(true)
    setError(null)

    getProducts({ category, type, search, page, minPrice, maxPrice, sort, signal: controller.signal })
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

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [category, type, search, page, minPrice, maxPrice, sort, enabled, refreshKey])

  const refetch = () => setRefreshKey((k) => k + 1)

  return { items, pagination, isLoading, error, refetch }
}
