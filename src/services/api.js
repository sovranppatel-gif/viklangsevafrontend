import axios from 'axios'
import { API_BASE_URL, USE_API } from '../config/env'
import { blogs } from '../data/blogs'
import { events } from '../data/events'
import { galleryItems, galleryVideos } from '../data/gallery'
import { impactStats } from '../data/organization'
import { programs } from '../data/programs'
import { reports } from '../data/reports'
import { stories } from '../data/stories'

export { API_BASE_URL, API_ORIGIN, USE_API } from '../config/env'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

function readHeader(headers, name) {
  if (!headers) return undefined
  if (typeof headers.get === 'function') return headers.get(name)
  return headers[name] || headers[name.toLowerCase()]
}

function writeHeader(headers, name, value) {
  if (!headers) return
  if (typeof headers.set === 'function') {
    headers.set(name, value)
    return
  }
  headers[name] = value
}

api.interceptors.request.use((config) => {
  config.headers = config.headers || {}

  const token = sessionStorage.getItem('vss_master_admin_token')
  if (token && !readHeader(config.headers, 'Authorization')) {
    writeHeader(config.headers, 'Authorization', `Bearer ${token}`)
  }

  // AxiosHeaders + FormData can keep application/json; that drops the file and
  // can also skip custom headers. Let the browser set the multipart boundary.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type')
    } else {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
  }

  return config
})

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

async function withFallback(endpoint, fallbackData) {
  if (!USE_API) {
    await delay()
    return { data: fallbackData, source: 'local' }
  }

  try {
    const response = await api.get(endpoint)
    return { data: response.data, source: 'api' }
  } catch (error) {
    console.warn(`API unavailable for ${endpoint}, using local data.`, error)
    await delay(200)
    return { data: fallbackData, source: 'fallback', error }
  }
}

export const fetchPrograms = () => withFallback('/programs', programs)
export const fetchProgramBySlug = async (slug) => {
  const { data, ...rest } = await fetchPrograms()
  return { data: data.find((item) => item.slug === slug) || null, ...rest }
}

export const fetchEvents = () => withFallback('/events', events)
export const fetchEventBySlug = async (slug) => {
  const { data, ...rest } = await fetchEvents()
  return { data: data.find((item) => item.slug === slug) || null, ...rest }
}

export const fetchBlogs = () => withFallback('/blogs', blogs)
export const fetchBlogBySlug = async (slug) => {
  const { data, ...rest } = await fetchBlogs()
  return { data: data.find((item) => item.slug === slug) || null, ...rest }
}

export const fetchStories = () => withFallback('/stories', stories)
export const fetchStoryBySlug = async (slug) => {
  const { data, ...rest } = await fetchStories()
  return { data: data.find((item) => item.slug === slug) || null, ...rest }
}

export const fetchGallery = () =>
  withFallback('/gallery', { photos: galleryItems, videos: galleryVideos })

export const fetchReports = () => withFallback('/reports', reports)
export const fetchImpactStats = () => withFallback('/impact-stats', impactStats)

export async function submitContactForm(payload) {
  const response = await api.post('/enquiries', payload)
  return response.data
}

export async function submitVolunteerForm(payload) {
  const response = await api.post('/volunteers', payload)
  return response.data
}

export async function submitDonationIntent(payload) {
  const response = await api.post('/donations', payload)
  return response.data
}
