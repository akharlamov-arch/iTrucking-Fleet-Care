/**
 * useCart — access global cart state and actions.
 *
 * @example
 *   const { items, addItem, itemCount } = useCart()
 */

import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return ctx
}
