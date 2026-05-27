import { useCallback, useEffect, useRef, useState } from 'react'
import { getProducts } from '@/utils/api'

/**
 * Infinite-scroll counterpart to `useProducts` — accumulates pages as the user
 * scrolls instead of jumping discrete page numbers.
 *
 * Behaviour:
 *   • The first effect run (or any filter change) resets `items` to [] and
 *     fetches page 1.
 *   • Subsequent calls to `loadMore()` fetch the next page and append.
 *   • In-flight requests are cancelled when filters change to prevent stale
 *     pages from sneaking into the list.
 *   • De-dupes by `id` so an overlap between two pages (rare race) cannot
 *     produce duplicate cards.
 *   • Exposes both the cumulative `items` list and a granular set of flags
 *     (`isLoading`, `isLoadingMore`) so the UI can differentiate the very
 *     first paint from the "loading more at the bottom" state.
 *
 * @param {object} params  — same shape as `useProducts` (minus `page`)
 * @returns {{
 *   items: object[],
 *   pagination: object|null,
 *   isLoading: boolean,        // true only on the initial paint of a filter set
 *   isLoadingMore: boolean,    // true while appending subsequent pages
 *   hasMore: boolean,
 *   loadMore: () => void,
 *   error: Error|null,
 *   refetch: () => void,
 *   totalCount: number,
 * }}
 */
export default function useInfiniteProducts({
  category,
  type,
  search,
  minPrice,
  maxPrice,
  sort = 'sku_desc',
  enabled = true,
} = {}) {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(Boolean(enabled))
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const controllerRef = useRef(null)
  const seenIdsRef = useRef(new Set())

  // Reset everything when filter inputs change.
  // We strip the values that *don't* invalidate the list (page resets internally).
  useEffect(() => {
    setItems([])
    setPagination(null)
    setError(null)
    setPage(1)
    seenIdsRef.current = new Set()
  }, [category, type, search, minPrice, maxPrice, sort, enabled, refreshKey])

  // Fetcher — runs on filter change AND every page bump.
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      setIsLoadingMore(false)
      return undefined
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const isFirstPage = page === 1
    if (isFirstPage) setIsLoading(true)
    else setIsLoadingMore(true)

    let cancelled = false

    getProducts({
      category,
      type,
      search,
      page,
      minPrice,
      maxPrice,
      sort,
      signal: controller.signal,
    })
      .then((result) => {
        if (cancelled) return

        // De-dupe across pages using a stable id set we maintain in a ref.
        // Also drop products with no real image (the normalizer flags those
        // that resolved to the server's default placeholder) — they create
        // awkward gaps in the grid and read as broken to the visitor.
        const nextItems = []
        for (const item of result.items) {
          if (item?.id == null || seenIdsRef.current.has(item.id)) continue
          if (!item.hasRealImage) continue
          seenIdsRef.current.add(item.id)
          nextItems.push(item)
        }

        setItems((prev) => (isFirstPage ? nextItems : [...prev, ...nextItems]))
        setPagination(result.pagination)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setError(err)
        if (isFirstPage) {
          setItems([])
          setPagination(null)
        }
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
        setIsLoadingMore(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, type, search, minPrice, maxPrice, sort, enabled, page, refreshKey])

  const totalPages = pagination?.total_pages || 1
  const totalCount = pagination?.total ?? items.length
  const hasMore = page < totalPages

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore || !enabled) return
    setPage((p) => p + 1)
  }, [hasMore, isLoading, isLoadingMore, enabled])

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

  return {
    items,
    pagination,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    refetch,
    totalCount,
  }
}
