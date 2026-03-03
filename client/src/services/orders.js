/**
 * Orders & Invoices API service.
 * Handles the full invoice-based checkout flow:
 *   Cart → createOrder → backend generates invoice PDF → emails to customer
 */

import api from './api'

/**
 * Create a new order (invoice request).
 * The backend will generate an invoice (FC-XXXXX) and email it.
 *
 * @param {object} orderData
 * @param {object} orderData.customer
 * @param {string} orderData.customer.companyName
 * @param {string} orderData.customer.contactName
 * @param {string} orderData.customer.email
 * @param {string} orderData.customer.phone
 * @param {string} orderData.customer.dotNumber
 * @param {string} orderData.customer.billingAddress
 * @param {CartItem[]} orderData.items
 * @param {'sacramento'|'loves'} orderData.location
 * @param {string} [orderData.notes]
 * @returns {Promise<{ orderId: number, invoiceNumber: string, total: number }>}
 */
export const createOrder = (orderData) =>
  api.post('/orders', orderData).then((r) => r.data)

/**
 * Fetch a single order by its ID.
 * @param {number} orderId
 * @returns {Promise<Order>}
 */
export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}`).then((r) => r.data)

/**
 * Get invoice PDF download URL for an order.
 * @param {number} orderId
 * @returns {string}  Absolute URL to download the PDF
 */
export const getInvoicePdfUrl = (orderId) =>
  `${api.defaults.baseURL}/orders/${orderId}/invoice.pdf`

/**
 * Fetch order history for the current guest session or company.
 * @param {string} email
 * @returns {Promise<Order[]>}
 */
export const getOrdersByEmail = (email) =>
  api.get('/orders', { params: { email } }).then((r) => r.data)
