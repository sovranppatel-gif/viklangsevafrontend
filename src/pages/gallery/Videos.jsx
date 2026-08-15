import { Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingState from '../../components/ui/LoadingState'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_GALLERY } from '../../data/galleryDefaults'
import { fetchGalleryCatalogCms, fetchGalleryContent } from '../../services/cms'

export default function Videos() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_GALLERY['gallery-videos'])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [pageData, catalog] = await Promise.all([
          fetchGalleryContent('gallery-videos'),
          fetchGalleryCatalogCms(),
        ])
        if (cancelled) return
        setContent({ ...DEFAULT_GALLERY['gallery-videos'], ...pageData })
        setVideos(Array.isArray(catalog?.videos) ? catalog.videos : [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!activeVideo) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setActiveVideo(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeVideo])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <>
      {content.isActive !== false ? (
        <PageHero
          label={pick(content.heroLabel, content.heroLabelHi)}
          title={pick(content.heroTitle, content.heroTitleHi)}
          description={pick(content.heroDescription, content.heroDescriptionHi)}
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Gallery', to: '/gallery' },
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Videos' },
          ]}
        />
      ) : null}
      <section className="section-padding">
        <div className="container-page">
          {loading ? <LoadingState /> : null}
          {error ? <ErrorState /> : null}
          {!loading && !error && videos.length === 0 ? (
            <EmptyState title="No videos uploaded yet" />
          ) : null}
          {!loading && !error && videos.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                >
                  <button
                    type="button"
                    className="relative block w-full text-left"
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Play ${pick(video.title, video.titleHi)}`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={pick(video.title, video.titleHi)}
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-navy/30">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
                        <Play className="ml-1 h-6 w-6 fill-current" />
                      </span>
                    </div>
                  </button>
                  <div className="p-5">
                    <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                      {pick(video.category, video.categoryHi)}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-navy">
                      {pick(video.title, video.titleHi)}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {activeVideo?.videoUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={pick(activeVideo.title, activeVideo.titleHi)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-t-2xl bg-black shadow-2xl sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-navy"
              aria-label="Close video"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                title={pick(activeVideo.title, activeVideo.titleHi)}
                src={`${activeVideo.videoUrl}${activeVideo.videoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
