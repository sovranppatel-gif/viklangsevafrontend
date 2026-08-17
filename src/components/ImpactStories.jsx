import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_IMPACT } from '../data/impactDefaults'
import { fetchImpactContent, fetchImpactStoriesCms } from '../services/cms'
import { mediaUrl } from '../utils/media'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

export default function ImpactStories({ hideHeader = false, limit } = {}) {
  const { isHi, t } = useLanguage()
  const [section, setSection] = useState(DEFAULT_IMPACT['home-stories'])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, stories] = await Promise.all([
          fetchImpactContent('home-stories'),
          fetchImpactStoriesCms(),
        ])
        if (cancelled) return
        setSection({ ...DEFAULT_IMPACT['home-stories'], ...sectionData })
        setData(Array.isArray(stories) ? stories : [])
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

  const pick = (en, hi) => (isHi && hi ? hi : en)
  const items = typeof limit === 'number' ? data.slice(0, limit) : data

  if (!hideHeader && section.isActive === false) return null

  return (
    <section id="impact" className="section-padding bg-white scroll-mt-28">
      <div className="container-page">
        {hideHeader ? null : (
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              label={pick(section.sectionLabel, section.sectionLabelHi)}
              title={pick(section.title, section.titleHi)}
              description={pick(section.description, section.descriptionHi)}
              align="left"
              className="mb-0 md:mb-0"
            />
            <Link to={section.viewAllLink || '/impact/stories'} className="link-arrow shrink-0 md:mb-2">
              {pick(section.viewAllLabel, section.viewAllLabelHi)}
            </Link>
          </div>
        )}

        {loading ? <LoadingState label={t('Loading stories…', 'कहानियाँ लोड हो रही हैं…')} /> : null}
        {error ? <ErrorState title={t('Unable to load stories', 'कहानियाँ लोड नहीं हो सकीं')} /> : null}
        {!loading && !error && items.length === 0 ? (
          <EmptyState title={t('Success stories coming soon', 'सफलता की कहानियाँ जल्द आ रही हैं')} />
        ) : null}

        {!loading && !error && items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((story, index) => (
              <motion.article
                key={story.id || story.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(11,29,54,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,29,54,0.12)] sm:rounded-3xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={mediaUrl(story.image)}
                    alt={pick(story.title, story.titleHi)}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-navy sm:text-xl">
                    {pick(story.title, story.titleHi)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted sm:mt-3">
                    {pick(story.excerpt, story.excerptHi)}
                  </p>
                  <Link to={`/impact/stories/${story.slug}`} className="link-arrow mt-5">
                    {t('Read Story →', 'कहानी पढ़ें →')}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
