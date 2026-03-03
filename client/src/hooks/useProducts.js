/**
 * useProducts — fetch products from the API with loading / error state.
 *
 * While the backend is not yet ready this hook returns empty data
 * without crashing; pages can fall back to static sample data.
 *
 * @example
 *   const { products, loading, error } = useProducts({ brands: ['hankook'] })
 */

import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '../services/products'

/**
 * @param {object} [filters]
 * @param {string[]} [filters.brands]
 * @param {string}   [filters.location]
 * @param {string}   [filters.sort]
 * @param {number}   [filters.page]
 * @param {number}   [filters.limit]
 */
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts(filters)
      setProducts(data.products ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      // Backend not available yet — silently ignore in development
      if (import.meta.env.DEV) {
        console.warn('[useProducts] API unavailable, using static data:', err.message)
      }
      setError(err)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  return { products, total, loading, error, refetch: fetch }
}
