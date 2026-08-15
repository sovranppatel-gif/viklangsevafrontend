import axios from 'axios'
import { blogs } from '../data/blogs'
import { events } from '../data/events'
import { galleryItems, galleryVideos } from '../data/gallery'
import { impactStats } from '../data/organization'
import { programs } from '../data/programs'
import { reports } from '../data/reports'
import { stories } from '../data/stories'

const USE_API = import.meta.env.VITE_USE_API === 'true'

function resolveApiBase() {
  const envBase = import.meta.env.VITE_API_BASE_URL || '/api'
  if (typeof window === 'undefined') return envBase

  const hostname = window.location.hostname
  const isLanHost = hostname !== 'localhost' && hostname !== '127.0.0.1'

  // Phone / another PC on Wi-Fi must hit this machine via the Vite proxy,
  // not the other device's own localhost.
  if (isLanHost) return '/api'

  return envBase
}

const API_BASE = resolveApiBase()

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('vss_master_admin_token')
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
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
