import { ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDate, formatDayMonth } from '../../utils/format'

export default function EventCard({
  event,
  index = 0,
  pick,
  variant = 'upcoming',
  detailsLabel = 'View details',
}) {
  const { day, month } = formatDayMonth(event.date)
  const isPast = variant === 'past'
  const title = pick(event.title, event.titleHi)
  const location = pick(event.location, event.locationHi)
  const description = pick(event.description, event.descriptionHi)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
      className={`group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(11,29,54,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,29,54,0.12)] ${
        isPast ? 'opacity-95' : ''
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {event.image ? (
          <img
            src={event.image}
            alt=""
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
              isPast ? 'saturate-75' : ''
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy/5 text-navy/40">
            <CalendarDays className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-3 pt-10">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
              isPast ? 'bg-white/90 text-navy' : 'bg-brand text-white'
            }`}
          >
            {isPast ? pick('Recently held', 'हाल ही में हुआ') : pick('Upcoming', 'आगामी')}
          </span>
        </div>
        <div
          className={`absolute top-3 left-3 flex h-14 w-14 flex-col items-center justify-center rounded-xl text-white shadow-lg ${
            isPast ? 'bg-navy' : 'bg-brand'
          }`}
        >
          <span className="text-lg font-bold leading-none">{day}</span>
          <span className="mt-0.5 text-[10px] font-semibold tracking-wide">{month}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs font-semibold text-brand">{formatDate(event.date)}</p>
        <h3 className="mt-1.5 line-clamp-2 text-lg font-bold text-navy">{title}</h3>
        {description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">{description}</p>
        ) : null}
        <p className="mt-3 flex items-start gap-1.5 text-sm text-text-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <span className="break-words">{location}</span>
        </p>
        {event.time ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted">
            <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            {event.time}
          </p>
        ) : null}
        <Link
          to={`/news/events/${event.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2.5"
        >
          {detailsLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
