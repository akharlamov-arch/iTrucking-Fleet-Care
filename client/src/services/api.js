/**
 * Axios instance — single entry point for all HTTP requests.
 *
 * Every service file (products, orders…) imports from here,
 * so auth headers, base URL, and interceptors are configured once.
 */

import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ──────────────────────────────────────────────────────
// Attach auth token when available (JWT will be stored in localStorage)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fc_auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ─────────────────────────────────────────────────────
// Normalize error shape so every catch block gets { message, status }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Unknown error'
    const status  = error.response?.status ?? 0
    return Promise.reject({ message, status, original: error })
  }
)

export default api
