import { api } from './api'
import { DEFAULT_HERO_CONTENT } from '../data/heroDefaults'
import { DEFAULT_ABOUT } from '../data/aboutDefaults'
import { DEFAULT_PROGRAMS, PROGRAM_ITEM_KEYS } from '../data/programsDefaults'
import { DEFAULT_BLOG } from '../data/blogDefaults'
import { DEFAULT_GALLERY } from '../data/galleryDefaults'
import { DEFAULT_REPORTS } from '../data/reportsDefaults'
import { DEFAULT_IMPACT } from '../data/impactDefaults'
import { DEFAULT_CONTACT_SETTINGS, mergeContactSettings } from '../data/contactSettingsDefaults'
import { stories as localStories } from '../data/stories'
import { impactStats as localImpactStats, donationCampaign as localCampaign } from '../data/organization'
import { programs as localPrograms } from '../data/programs'
import { blogs as localBlogs } from '../data/blogs'
import { events as localEvents } from '../data/events'
import { galleryItems, galleryVideos } from '../data/gallery'
import { reports as localReports } from '../data/reports'

export async function fetchHeroContent() {
  try {
    const response = await api.get('/cms/hero')
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Hero CMS API unavailable, using defaults.', error)
  }
  return { ...DEFAULT_HERO_CONTENT }
}

export async function updateHeroContent(payload, token) {
  const response = await api.put('/cms/hero', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadHeroImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/hero/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchAboutContent(key) {
  try {
    const response = await api.get(`/cms/about/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`About CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_ABOUT[key] || {})
}

export async function updateAboutContent(key, payload, token) {
  const response = await api.put(`/cms/about/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadAboutImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/about/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchProgramsContent(key) {
  try {
    const response = await api.get(`/cms/programs/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`Programs CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_PROGRAMS[key] || {})
}

export async function updateProgramsContent(key, payload, token) {
  const response = await api.put(`/cms/programs/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadProgramsImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/programs/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchProgramsCatalog() {
  try {
    const response = await api.get('/cms/programs/catalog')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Programs catalog API unavailable, using defaults.', error)
  }

  return PROGRAM_ITEM_KEYS.map((key) => structuredClone(DEFAULT_PROGRAMS[key])).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchProgramBySlugCms(slug) {
  const items = await fetchProgramsCatalog()
  return (
    items.find((item) => item.slug === slug) ||
    localPrograms.find((p) => p.slug === slug) ||
    null
  )
}

export async function fetchBlogContent(key) {
  try {
    const response = await api.get(`/cms/blog/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`Blog CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_BLOG[key] || {})
}

export async function updateBlogContent(key, payload, token) {
  const response = await api.put(`/cms/blog/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadBlogImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/blog/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchBlogArticles() {
  try {
    const response = await api.get('/cms/blog/articles')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Blog articles API unavailable, using defaults.', error)
  }
  return (DEFAULT_BLOG['blog-articles']?.items || localBlogs).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchBlogBySlugCms(slug) {
  const items = await fetchBlogArticles()
  return items.find((item) => item.slug === slug) || localBlogs.find((b) => b.slug === slug) || null
}

export async function fetchEventItemsCms() {
  try {
    const response = await api.get('/cms/blog/events')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Event items API unavailable, using defaults.', error)
  }
  return (DEFAULT_BLOG['event-items']?.items || localEvents).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchEventBySlugCms(slug) {
  const items = await fetchEventItemsCms()
  return items.find((item) => item.slug === slug) || localEvents.find((e) => e.slug === slug) || null
}

export async function fetchGalleryContent(key) {
  try {
    const response = await api.get(`/cms/gallery/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`Gallery CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_GALLERY[key] || {})
}

export async function updateGalleryContent(key, payload, token) {
  const response = await api.put(`/cms/gallery/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadGalleryImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/gallery/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchGalleryCatalogCms() {
  try {
    const response = await api.get('/cms/gallery/catalog')
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Gallery catalog API unavailable, using defaults.', error)
  }
  return {
    photos: (DEFAULT_GALLERY['gallery-photo-items']?.items || galleryItems).filter(
      (item) => item?.isActive !== false,
    ),
    videos: (DEFAULT_GALLERY['gallery-video-items']?.items || galleryVideos).filter(
      (item) => item?.isActive !== false,
    ),
  }
}

export async function fetchReportsContent(key) {
  try {
    const response = await api.get(`/cms/reports/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`Reports CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_REPORTS[key] || {})
}

export async function updateReportsContent(key, payload, token) {
  const response = await api.put(`/cms/reports/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadReportsDocument(file, token) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/cms/reports/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchReportItemsCms() {
  try {
    const response = await api.get('/cms/reports/items')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Reports items API unavailable, using defaults.', error)
  }
  return (DEFAULT_REPORTS['report-items']?.items || localReports).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchContactSettings() {
  try {
    const response = await api.get('/cms/settings/contact')
    if (response.data?.success && response.data?.data) {
      return mergeContactSettings(response.data.data)
    }
  } catch (error) {
    console.warn('Contact settings API unavailable, using defaults.', error)
  }
  return mergeContactSettings(DEFAULT_CONTACT_SETTINGS)
}

export async function updateContactSettings(payload, token) {
  const response = await api.put('/cms/settings/contact', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchImpactContent(key) {
  try {
    const response = await api.get(`/cms/impact/${key}`)
    if (response.data?.success && response.data?.data) {
      return response.data.data
    }
  } catch (error) {
    console.warn(`Impact CMS API unavailable for ${key}, using defaults.`, error)
  }
  return structuredClone(DEFAULT_IMPACT[key] || {})
}

export async function updateImpactContent(key, payload, token) {
  const response = await api.put(`/cms/impact/${key}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function uploadImpactImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/cms/impact/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchImpactStoriesCms() {
  try {
    const response = await api.get('/cms/impact/stories')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Impact stories API unavailable, using defaults.', error)
  }
  return (DEFAULT_IMPACT['story-items']?.items || localStories).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchStoryBySlugCms(slug) {
  const items = await fetchImpactStoriesCms()
  return (
    items.find((item) => item.slug === slug) ||
    localStories.find((story) => story.slug === slug) ||
    null
  )
}

export async function fetchImpactStatsCms() {
  try {
    const response = await api.get('/cms/impact/stats')
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data
    }
  } catch (error) {
    console.warn('Impact stats API unavailable, using defaults.', error)
  }
  return (DEFAULT_IMPACT['impact-stats']?.items || localImpactStats).filter(
    (item) => item?.isActive !== false,
  )
}

export async function fetchImpactCampaignCms() {
  try {
    const response = await api.get('/cms/impact/campaign')
    if (response.data?.success && response.data?.data) {
      return { ...structuredClone(DEFAULT_IMPACT['impact-campaign']), ...response.data.data }
    }
  } catch (error) {
    console.warn('Impact campaign API unavailable, using defaults.', error)
  }
  return structuredClone(DEFAULT_IMPACT['impact-campaign'] || localCampaign)
}
