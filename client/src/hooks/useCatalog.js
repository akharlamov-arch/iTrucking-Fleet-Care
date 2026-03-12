import { useState, useEffect, useCallback } from 'react'
import { fetchCatalog, FALLBACK_PRODUCTS } from '../services/catalogService'

/**
 * useCatalog()
 *
 * Returns the product catalog from Google Sheets (or fallback sample data).
 *
 * Usage:
 *   const { products, loading, error, getFamily } = useCatalog()
 *
 * • loading    — true while the first fetch is in flight
 * • error      — non-null string if the fetch failed (products = fallback data)
 * • products   — array of product objects ready to use
 * • getFamily  — (familyId: string) => Product[]
 *                returns all products that share the same family_id (i.e. all
 *                sizes of the same tire model). Used by the Product page to
 *                build the size selector and the Size Details table.
 */
export function useCatalog() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchCatalog()
      .then(data => {
        if (cancelled) return
        // null means VITE_SHEETS_CSV_URL not set → use sample data silently
        setProducts(data ?? FALLBACK_PRODUCTS)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.error('[useCatalog] fetch error:', err.message)
        setProducts(FALLBACK_PRODUCTS)
        setLoading(false)
        setError(err.message)
      })

    return () => { cancelled = true }
  }, [])

  /**
   * Returns all products that belong to the same tire family (same model,
   * different sizes). Sorted by size string for consistent table order.
   */
  const getFamily = useCallback((familyId) => {
    if (!familyId) return []
    return products
      .filter(p => p.familyId === familyId)
      .sort((a, b) => a.size.localeCompare(b.size))
  }, [products])

  return { products, loading, error, getFamily }
}
