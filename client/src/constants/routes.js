/**
 * Application route definitions.
 * Always import paths from here — never hardcode strings in <Link to="...">
 *
 * @example
 *   import { ROUTES } from '@/constants/routes'
 *   <Link to={ROUTES.CATALOG}>Catalog</Link>
 *   <Link to={ROUTES.productById(42)}>Open product</Link>
 */

export const ROUTES = {
  HOME:     '/',
  CATALOG:  '/catalog',
  PRODUCT:  '/product/:id',    // for <Route> definition
  CART:     '/cart',
  CHECKOUT: '/checkout',

  /** Build the concrete URL for a product page */
  productById: (id) => `/product/${id}`,
}
