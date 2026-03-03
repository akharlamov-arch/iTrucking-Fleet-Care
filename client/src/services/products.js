/**
 * Products API service.
 * All product-related HTTP calls go through here.
 * When the backend is ready, nothing in the React pages needs to change —
 * only these functions.
 */

import api from './api'

/**
 * Fetch paginated product list with optional filters.
 * @param {object} params
 * @param {string[]} [params.brands]
 * @param {string}   [params.location]   'sacramento' | 'loves'
 * @param {string}   [params.category]
 * @param {string}   [params.sort]       'price_asc' | 'price_desc' | 'discount'
 * @param {number}   [params.page]
 * @param {number}   [params.limit]
 * @returns {Promise<{ products: Product[], total: number, page: number, pages: number }>}
 */
export const getProducts = (params = {}) =>
  api.get('/products', { params }).then((r) => r.data)

/**
 * Fetch a single product by ID or slug.
 * @param {string|number} id
 * @returns {Promise<Product>}
 */
export const getProductById = (id) =>
  api.get(`/products/${id}`).then((r) => r.data)

/**
 * Fetch featured / deal products for the home page.
 * @returns {Promise<Product[]>}
 */
export const getFeaturedProducts = () =>
  api.get('/products/featured').then((r) => r.data)

/**
 * Fetch available tire sizes for a given product (for size select).
 * @param {string|number} productId
 * @returns {Promise<TireSize[]>}
 */
export const getProductSizes = (productId) =>
  api.get(`/products/${productId}/sizes`).then((r) => r.data)
