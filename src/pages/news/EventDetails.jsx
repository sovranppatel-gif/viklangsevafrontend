import { Clock, MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingState from '../../components/ui/LoadingState'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { fetchEventBySlugCms } from '../../services/cms'
import { isPastEvent, isUpcomingEvent } from '../../utils/events'
import { formatDate } from '../../utils/format'

export default function EventDetails() {
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
        const event = await fetchEventBySlugCms(slug)
        if (!cancelled) setData(event)
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
  const status = useMemo(() => {
    if (!data) return null
    if (isUpcomingEvent(data)) return 'upcoming'
    if (isPastEvent(data)) return 'past'
    return null
  }, [data])

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

  if (!data || data.isActive === false) {
    return (
      <div className="container-page section-padding">
        <EmptyState title="Event not found" />
      </div>
    )
  }

  return (
    <>
      <PageHero
        label={
          status === 'past'
            ? t('Recently held event', 'हाल ही में हुआ कार्यक्रम')
            : t('Upcoming event', 'आगामी कार्यक्रम')
        }
        title={pick(data.title, data.titleHi)}
        description={pick(data.description, data.descriptionHi)}
        image={data.image}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Events', to: '/news/events' },
          { label: pick(data.title, data.titleHi) },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <img
            src={data.image}
            alt={pick(data.title, data.titleHi)}
            className="h-80 w-full rounded-3xl object-cover"
            loading="lazy"
          />
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                status === 'past' ? 'bg-muted text-navy' : 'bg-brand-soft text-brand'
              }`}
            >
              {status === 'past'
                ? t('Recently held', 'हाल ही में हुआ')
                : t('Upcoming', 'आगामी')}
            </span>
            <p className="mt-3 text-sm font-semibold text-brand">{formatDate(data.date)}</p>
            <h2 className="mt-2 text-2xl font-bold text-navy">
              {pick(data.title, data.titleHi)}
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              {pick(data.description, data.descriptionHi)}
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-text-muted">
              <MapPin className="h-4 w-4 text-brand" /> {pick(data.location, data.locationHi)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
              <Clock className="h-4 w-4 text-brand" /> {data.time}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {status === 'upcoming' ? (
                <Link to={data.ctaLink || '/get-involved/volunteer'} className="btn-primary">
                  {pick(data.ctaLabel, data.ctaLabelHi) || 'Join as Volunteer'}
                </Link>
              ) : (
                <Link to="/news/events" className="btn-primary">
                  {t('See more events', 'और कार्यक्रम देखें')}
                </Link>
              )}
              <Link to="/news/events" className="btn-outline">
                {t('All events', 'सभी कार्यक्रम')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
