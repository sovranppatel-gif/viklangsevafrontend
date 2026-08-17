import { API_ORIGIN } from '../config/env'

export function mediaUrl(url) {
  if (!url) return ''

  const value = String(url)
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value
  }

  if (value.startsWith('/uploads/')) {
    return API_ORIGIN ? `${API_ORIGIN}${value}` : value
  }

  return value
}
