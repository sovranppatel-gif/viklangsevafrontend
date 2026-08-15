function apiOrigin() {
  const raw = String(import.meta.env.VITE_API_BASE_URL || '')
    .trim()
    .replace(/\/$/, '')

  if (!raw || raw === '/api') return ''
  return raw.replace(/\/api$/, '')
}

export function mediaUrl(url) {
  if (!url) return ''

  const value = String(url)
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value
  }

  if (value.startsWith('/uploads/')) {
    const origin = apiOrigin()
    return origin ? `${origin}${value}` : value
  }

  return value
}
