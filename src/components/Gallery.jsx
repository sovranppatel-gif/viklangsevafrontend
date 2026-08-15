import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_GALLERY } from '../data/galleryDefaults'
import { fetchGalleryCatalogCms, fetchGalleryContent } from '../services/cms'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

export default function Gallery({ showHeader = true, limit }) {
  const { isHi } = useLanguage()
  const [section, setSection] = useState(DEFAULT_GALLERY['home-gallery'])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, catalog] = await Promise.all([
          fetchGalleryContent('home-gallery'),
          fetchGalleryCatalogCms(),
        ])
        if (cancelled) return
        const nextSection = { ...DEFAULT_GALLERY['home-gallery'], ...sectionData }
        setSection(nextSection)
        const allPhotos = Array.isArray(catalog?.photos) ? catalog.photos : []
        const previewLimit =
          typeof limit === 'number' ? limit : Number(nextSection.previewLimit) || 6
        setPhotos(previewLimit > 0 ? allPhotos.slice(0, previewLimit) : allPhotos)
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
  }, [limit])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (section.isActive === false && showHeader) return null

  return (
    <section id="gallery" className="section-padding bg-white scroll-mt-28">
      <div className="container-page">
        {showHeader ? (
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              label={pick(section.sectionLabel, section.sectionLabelHi)}
              title={pick(section.title, section.titleHi)}
              description={pick(section.description, section.descriptionHi)}
              align="left"
              className="mb-0 md:mb-0"
            />
            <Link
              to={section.viewAllLink || '/gallery'}
              className="link-arrow shrink-0 md:mb-2"
            >
              {pick(section.viewAllLabel, section.viewAllLabelHi)}
            </Link>
          </div>
        ) : null}

        {loading ? <LoadingState label="Loading gallery…" /> : null}
        {error ? <ErrorState title="Unable to load gallery" /> : null}
        {!loading && !error && photos.length === 0 ? (
          <EmptyState title="Gallery photos will appear here" />
        ) : null}

        {!loading && !error && photos.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.map((item, index) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`group overflow-hidden rounded-2xl ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={item.image}
                  alt={pick(item.title, item.titleHi)}
                  className={`w-full object-cover transition duration-500 group-hover:scale-110 ${
                    index === 0 ? 'h-48 sm:h-64 md:h-full' : 'h-36 sm:h-44 md:h-56'
                  }`}
                  loading="lazy"
                />
              </motion.figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
