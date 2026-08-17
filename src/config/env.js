const PRODUCTION_API_ORIGIN = 'https://viklangsevaserver.vercel.app'

function stripSlash(value) {
  return String(value || '')
    .trim()
    .replace(/\/$/, '')
}

function originFromEnv() {
  const raw = stripSlash(import.meta.env.VITE_API_BASE_URL || '')
  if (raw && raw !== '/api') {
    return raw.replace(/\/api$/, '')
  }

  // Vite bakes env at build time. If Vercel env was missing during build,
  // production still talks to the live API instead of same-origin /api.
  if (import.meta.env.PROD) return PRODUCTION_API_ORIGIN
  return ''
}

/** true when backend calls should run */
export const USE_API = import.meta.env.PROD || import.meta.env.VITE_USE_API === 'true'

/**
 * Backend origin from `.env` `VITE_API_BASE_URL`.
 * Example: http://localhost:5000 or https://viklangsevaserver.vercel.app
 */
export const API_ORIGIN = originFromEnv()

/**
 * Axios / fetch base URL (always includes /api).
 * Example: http://localhost:5000/api
 */
export const API_BASE_URL = API_ORIGIN
  ? API_ORIGIN.endsWith('/api')
    ? API_ORIGIN
    : `${API_ORIGIN}/api`
  : '/api'
