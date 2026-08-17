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
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {upcoming.map((event, index) => {
              const { day, month } = formatDayMonth(event.date)
              return (
                <motion.article
                  key={event.id || event.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="card card-hover flex gap-3 p-3 sm:p-4"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand text-white">
                    <span className="text-lg font-bold leading-none">{day}</span>
                    <span className="mt-0.5 text-[10px] font-semibold tracking-wide">
                      {month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase">
                      {pick('Upcoming', 'आगामी')}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-navy sm:text-base">
                      {pick(event.title, event.titleHi)}
                    </h3>
                    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-text-muted sm:text-sm">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="line-clamp-2 break-words">
                        {pick(event.location, event.locationHi)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted sm:text-sm">
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {event.time}
                    </p>
                    <Link to={`/news/events/${event.slug}`} className="link-arrow mt-2 text-xs sm:text-sm">
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
