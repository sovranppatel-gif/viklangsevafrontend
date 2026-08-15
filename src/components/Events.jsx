import { Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_BLOG } from '../data/blogDefaults'
import { fetchBlogContent, fetchEventItemsCms } from '../services/cms'
import { splitEventsByTiming } from '../utils/events'
import { formatDayMonth } from '../utils/format'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

export default function Events({ limit = 3 } = {}) {
  const { isHi } = useLanguage()
  const [section, setSection] = useState(DEFAULT_BLOG['home-events'])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, events] = await Promise.all([
          fetchBlogContent('home-events'),
          fetchEventItemsCms(),
        ])
        if (cancelled) return
        setSection({ ...DEFAULT_BLOG['home-events'], ...sectionData })
        setData(Array.isArray(events) ? events : [])
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
  const upcoming = useMemo(() => splitEventsByTiming(data).upcoming.slice(0, limit), [data, limit])

  if (section.isActive === false) return null

  return (
    <section id="news" className="section-padding bg-muted scroll-mt-28">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={pick(section.sectionLabel, section.sectionLabelHi)}
            title={pick(section.title, section.titleHi)}
            description={pick(section.description, section.descriptionHi)}
            align="left"
            className="mb-0 md:mb-0"
          />
          <Link to={section.viewAllLink || '/news/events'} className="link-arrow shrink-0 md:mb-2">
            {pick(section.viewAllLabel, section.viewAllLabelHi)}
          </Link>
        </div>

        {loading ? <LoadingState label="Loading events…" /> : null}
        {error ? <ErrorState title="Unable to load events" /> : null}
        {!loading && !error && upcoming.length === 0 ? (
          <EmptyState title="No upcoming events right now" description="Please check back soon." />
        ) : null}

        {!loading && !error && upcoming.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((event, index) => {
              const { day, month } = formatDayMonth(event.date)
              return (
                <motion.article
                  key={event.id || event.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="card card-hover flex gap-3 sm:gap-4"
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand text-white sm:h-20 sm:w-20">
                    <span className="text-xl font-bold leading-none sm:text-2xl">{day}</span>
                    <span className="mt-1 text-[10px] font-semibold tracking-wide sm:text-xs">
                      {month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase">
                      {pick('Upcoming', 'आगामी')}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-navy sm:text-lg">
                      {pick(event.title, event.titleHi)}
                    </h3>
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-text-muted">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="break-words">
                        {pick(event.location, event.locationHi)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {event.time}
                    </p>
                    <Link to={`/news/events/${event.slug}`} className="link-arrow mt-3">
                      {pick(section.detailsLabel, section.detailsLabelHi)}
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
