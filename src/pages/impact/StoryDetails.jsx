import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingState from '../../components/ui/LoadingState'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { fetchStoryBySlugCms } from '../../services/cms'
import { formatDate } from '../../utils/format'

export default function StoryDetails() {
  const { slug } = useParams()
  const { isHi, t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const story = await fetchStoryBySlugCms(slug)
        if (!cancelled) setData(story)
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
  }, [slug])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (loading) {
    return (
      <div className="container-page section-padding">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-page section-padding">
        <ErrorState />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container-page section-padding">
        <EmptyState title={t('Story not found', 'कहानी नहीं मिली')} />
      </div>
    )
  }

  const title = pick(data.title, data.titleHi)

  return (
    <>
      <PageHero
        label={pick(data.category, data.categoryHi)}
        title={title}
        description={pick(data.excerpt, data.excerptHi)}
        image={data.image}
        crumbs={[
          { label: t('Home', 'होम'), to: '/' },
          { label: t('Impact', 'प्रभाव'), to: '/impact' },
          { label: t('Stories', 'कहानियाँ'), to: '/impact/stories' },
          { label: title },
        ]}
      />
      <section className="section-padding">
        <div className="container-page max-w-3xl">
          <p className="text-sm text-text-muted">{formatDate(data.date)}</p>
          <img
            src={data.image}
            alt={title}
            className="mt-6 h-80 w-full rounded-3xl object-cover"
            loading="lazy"
          />
          <p className="mt-8 text-lg leading-relaxed whitespace-pre-wrap text-text-muted">
            {pick(data.content, data.contentHi)}
          </p>
          <Link to="/donate" className="btn-primary mt-8">
            {t('Support More Stories Like This', 'ऐसी और कहानियों का समर्थन करें')}
          </Link>
        </div>
      </section>
    </>
  )
}
