// Prepends Vite's BASE_URL so assets work both locally and on GitHub Pages
const base = import.meta.env.BASE_URL.replace(/\/$/, '') // strip trailing slash

export function assetUrl(path) {
  if (!path) return ''
  // Already absolute (http/https) — return as-is
  if (path.startsWith('http')) return path
  // Ensure leading slash
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
