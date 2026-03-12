/**
 * CartContext — global cart state with localStorage persistence.
 *
 * Wrap the app in <CartProvider> (done in main.jsx).
 * Consume cart state in any component via the useCart hook:
 *   import { useCart } from '@/hooks/useCart'
 */

import { createContext, useContext, useReducer, useEffect } from 'react'
import { INVOICE } from '../constants/config'

// ─── Context ──────────────────────────────────────────────────────────────────
export const CartContext = createContext(null)

// ─── Storage key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'fc_cart'
const CART_VERSION = 2  // bump when cart item shape changes — clears stale data

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // version mismatch → discard old data
    if (parsed.version !== CART_VERSION) return []
    return parsed.items ?? []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CART_VERSION, items }))
}

// ─── Cart Item shape ──────────────────────────────────────────────────────────
// {
//   key:       string   — unique: `${productId}_${size}_${location}`
//   productId: string|number
//   name:      string
//   size:      string   — tire size, e.g. "295/60R22.5"
//   location:  'sacramento' | 'loves'
//   price:     number   — unit price (after discount, ex-tax)
//   quantity:  number
//   image:     string
// }

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const { item } = action
      const key = `${item.productId}_${item.size}_${item.location}`
      const existing = state.find((i) => i.key === key)
      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...state, { ...item, key }]
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.key !== action.key)

    case 'UPDATE_QUANTITY':
      return state.map((i) =>
        i.key === action.key
          ? { ...i, quantity: Math.max(1, action.quantity) }
          : i
      )

    case 'CLEAR_CART':
      return []

    case 'HYDRATE':
      return action.items

    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)

  // Persist to localStorage whenever items change
  useEffect(() => {
    try { saveCart(items) } catch { /* storage full or blocked */ }
  }, [items])

  // ── Derived values ──────────────────────────────────────────────────────────
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax       = +(subtotal * INVOICE.taxRate).toFixed(2)
  const total     = +(subtotal + tax).toFixed(2)

  // ── Actions ─────────────────────────────────────────────────────────────────
  /**
   * @param {object} item  See "Cart Item shape" above (without the `key`)
   */
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item })

  /** @param {string} key */
  const removeItem = (key) => dispatch({ type: 'REMOVE_ITEM', key })

  /**
   * @param {string} key
   * @param {number} quantity  Must be ≥ 1
   */
  const updateQuantity = (key, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', key, quantity })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const value = {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
