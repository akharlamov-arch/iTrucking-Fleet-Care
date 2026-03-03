/**
 * Formatting utilities.
 * Pure functions — no side effects, no imports.
 */

/**
 * Format a number as USD currency.
 * @param {number} value
 * @param {boolean} [withCents=true]
 * @returns {string}  "$485.00"
 */
export function formatPrice(value, withCents = true) {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(value)
}

/**
 * Format a decimal (0–1) or integer percent as a discount label.
 * @param {number} value  — pass 0.40 OR 40
 * @returns {string}  "-40%"
 */
export function formatDiscount(value) {
  const pct = value <= 1 ? Math.round(value * 100) : Math.round(value)
  return `-${pct}%`
}

/**
 * Format an ISO date string or Date object for display.
 * @param {string|Date} date
 * @param {'short'|'long'} [style='short']
 * @returns {string}  e.g. "Mar 2, 2026"
 */
export function formatDate(date, style = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d)) return ''
  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: style === 'long' ? 'long' : 'short',
    day:   'numeric',
  }).format(d)
}

/**
 * Pad an invoice number to the standard company format.
 * @param {number} n
 * @returns {string}  "FC-00001"
 */
export function formatInvoiceNumber(n) {
  return `FC-${String(n).padStart(5, '0')}`
}

/**
 * Truncate a string and append ellipsis if it exceeds maxLen.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str
  return `${str.slice(0, maxLen - 1)}…`
}

/**
 * Convert a slug to a readable title.
 * @param {string} slug  "hankook-dl15"
 * @returns {string}     "Hankook Dl15"
 */
export function slugToTitle(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
