import { CalendarCheck2, CalendarClock, Clock, HeartHandshake, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../../components/events/EventCard'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingState from '../../components/ui/LoadingState'
import PageHero from '../../components/ui/PageHero'
import SectionHeader from '../../components/ui/SectionHeader'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_BLOG } from '../../data/blogDefaults'
import { fetchBlogContent, fetchEventItemsCms } from '../../services/cms'
import { splitEventsByTiming } from '../../utils/events'
import { formatDate, formatDayMonth } from '../../utils/format'
import { mediaUrl } from '../../utils/media'

export default function EventsPage() {
  const { isHi, t } = useLanguage()
  const [content, setContent] = useState(DEFAULT_BLOG['news-events'])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [pageContent, items] = await Promise.all([
          fetchBlogContent('news-events'),
          fetchEventItemsCms(),
        ])
        if (cancelled) return
        setContent({ ...DEFAULT_BLOG['news-events'], ...pageContent })
        setEvents(Array.isArray(items) ? items : [])
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
  const { upcoming, past } = useMemo(() => splitEventsByTiming(events), [events])
  const featured = upcoming[0] || null

  const filters = [
    { id: 'all', label: t('All events', 'सभी कार्यक्रम'), count: events.length },
    { id: 'upcoming', label: t('Upcoming', 'आगामी'), count: upcoming.length },
    { id: 'past', label: t('Recently held', 'हाल ही में हुए'), count: past.length },
  ]

  const showUpcoming = filter === 'all' || filter === 'upcoming'
  const showPast = filter === 'all' || filter === 'past'

  return (
    <>
      {content.isActive !== false ? (
        <PageHero
          label={pick(content.heroLabel, content.heroLabelHi)}
          title={pick(content.heroTitle, content.heroTitleHi)}
          description={pick(content.heroDescription, content.heroDescriptionHi)}
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'News & Events', to: '/news' },
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Events' },
          ]}
        />
      ) : null}

      <section className="border-b border-border bg-white">
        <div className="container-page grid gap-3 py-5 sm:grid-cols-3 sm:py-6">
          <div className="flex items-center gap-3 rounded-2xl bg-brand-soft/60 px-4 py-3">
            <span className="rounded-xl bg-brand p-2.5 text-white">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-navy">{upcoming.length}</p>
              <p className="text-xs font-medium text-text-muted">
                {t('Upcoming events', 'आगामी कार्यक्रम')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
            <span className="rounded-xl bg-navy p-2.5 text-white">
              <CalendarCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-navy">{past.length}</p>
              <p className="text-xs font-medium text-text-muted">
                {t('Recently held', 'हाल ही में हुए')}
              </p>
            </div>
          </div>
          <Link
            to="/get-involved/volunteer"
            className="flex items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white transition hover:bg-navy-light"
          >
            <span className="rounded-xl bg-white/10 p-2.5">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">{t('Be part of it', 'इसका हिस्सा बनें')}</p>
              <p className="text-xs text-white/70">
                {t('Volunteer at our next event', 'अगले कार्यक्रम में स्वयंसेवक बनें')}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page">
          {loading ? <LoadingState label={t('Loading events…', 'कार्यक्रम लोड हो रहे हैं…')} /> : null}
          {error ? (
            <ErrorState title={t('Unable to load events', 'कार्यक्रम लोड नहीं हो सके')} />
          ) : null}

          {!loading && !error ? (
            <>
              <div className="mb-8 flex flex-wrap gap-2">
                {filters.map((item) => {
                  const active = filter === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? 'bg-brand text-white shadow-sm'
                          : 'bg-muted text-navy hover:bg-brand-soft hover:text-brand'
                      }`}
                    >
                      {item.label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          active ? 'bg-white/20 text-white' : 'bg-white text-text-muted'
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {!events.length ? (
                <EmptyState
                  title={t('No events listed yet', 'अभी कोई कार्यक्रम सूचीबद्ध नहीं है')}
                  description={t(
                    'Please check back soon for community programs and celebrations.',
                    'कृपया जल्द ही सामुदायिक कार्यक्रमों और उत्सवों के लिए वापस देखें।',
                  )}
                />
              ) : null}

              {featured && showUpcoming && filter !== 'past' ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_12px_40px_rgba(11,29,54,0.08)] lg:mb-16"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="relative min-h-[240px] overflow-hidden bg-muted sm:min-h-[320px]">
                      {featured.image ? (
                        <img
                          src={mediaUrl(featured.image)}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent lg:bg-gradient-to-r" />
                      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t('Next up', 'अगला कार्यक्रम')}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                      {(() => {
                        const { day, month } = formatDayMonth(featured.date)
                        return (
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-brand text-white">
                              <span className="text-lg font-bold leading-none">{day}</span>
                              <span className="text-[10px] font-semibold">{month}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-brand">{formatDate(featured.date)}</p>
                              <p className="text-xs text-text-muted">{featured.time}</p>
                            </div>
                          </div>
                        )
                      })()}
                      <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                        {pick(featured.title, featured.titleHi)}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
                        {pick(featured.description, featured.descriptionHi)}
                      </p>
                      <p className="mt-4 flex items-start gap-2 text-sm text-text-muted">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {pick(featured.location, featured.locationHi)}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                        <Clock className="h-4 w-4 shrink-0 text-brand" />
                        {featured.time}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link to={`/news/events/${featured.slug}`} className="btn-primary sm:w-auto">
                          {t('View event details', 'विवरण देखें')}
                        </Link>
                        <Link
                          to={featured.ctaLink || '/get-involved/volunteer'}
                          className="btn-outline sm:w-auto"
                        >
                          {pick(featured.ctaLabel, featured.ctaLabelHi) ||
                            t('Join as Volunteer', 'स्वयंसेवक बनें')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {showUpcoming ? (
                <div id="upcoming-events" className="scroll-mt-28">
                  <SectionHeader
                    align="left"
                    label={t('Coming soon', 'जल्द आ रहा है')}
                    title={t('Upcoming Events', 'आगामी कार्यक्रम')}
                    description={t(
                      'Join celebrations, camps and community programs happening next.',
                      'आने वाले उत्सवों, शिविरों और सामुदायिक कार्यक्रमों में शामिल हों।',
                    )}
                    className="mb-8 md:mb-10"
                  />
                  {(() => {
                    const list =
                      filter === 'all' && featured ? upcoming.slice(1) : upcoming
                    if (!upcoming.length) {
                      return (
                        <EmptyState
                          title={t(
                            'No upcoming events right now',
                            'अभी कोई आगामी कार्यक्रम नहीं है',
                          )}
                          description={t(
                            'New programs will appear here as soon as they are announced.',
                            'नई घोषणा होते ही कार्यक्रम यहाँ दिखेंगे।',
                          )}
                        />
                      )
                    }
                    if (!list.length) return null
                    return (
                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {list.map((event, index) => (
                          <EventCard
                            key={event.id || event.slug}
                            event={event}
                            index={index}
                            pick={pick}
                            variant="upcoming"
                            detailsLabel={t('View details', 'विवरण देखें')}
                          />
                        ))}
                      </div>
                    )
                  })()}
                </div>
              ) : null}

              {showPast ? (
                <div
                  id="recently-held-events"
                  className={`scroll-mt-28 ${showUpcoming ? 'mt-16 border-t border-border pt-16 md:mt-20 md:pt-20' : ''}`}
                >
                  <SectionHeader
                    align="left"
                    label={t('Our journey', 'हमारी यात्रा')}
                    title={t('Recently Held Events', 'हाल ही में हुए कार्यक्रम')}
                    description={t(
                      'A look back at programs we completed with our community.',
                      'समुदाय के साथ पूरे किए गए कार्यक्रमों की झलक।',
                    )}
                    className="mb-8 md:mb-10"
                  />
                  {past.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {past.map((event, index) => (
                        <EventCard
                          key={event.id || event.slug}
                          event={event}
                          index={index}
                          pick={pick}
                          variant="past"
                          detailsLabel={t('View recap', 'सारांश देखें')}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title={t('No past events to show yet', 'अभी कोई पिछले कार्यक्रम नहीं हैं')}
                      description={t(
                        'Completed events will be listed here after they take place.',
                        'कार्यक्रम पूरे होने के बाद वे यहाँ सूचीबद्ध होंगे।',
                      )}
                    />
                  )}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      <section className="bg-muted section-padding pt-0 md:pt-0">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-navy px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <p className="section-label text-accent-yellow">{t('Get involved', 'जुड़ें')}</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t(
                  'Want to help at the next event?',
                  'अगले कार्यक्रम में मदद करना चाहते हैं?',
                )}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                {t(
                  'Volunteers make camps, celebrations and outreach possible. Join hands with Viklang Sewa Sansthan.',
                  'स्वयंसेवक शिविर, उत्सव और आउटरीच संभव बनाते हैं। विकलांग सेवा संस्थान के साथ जुड़ें।',
                )}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
              <Link to="/get-involved/volunteer" className="btn-primary">
                {t('Become a Volunteer', 'स्वयंसेवक बनें')}
              </Link>
              <Link to="/contact" className="btn-secondary">
                {t('Contact Us', 'संपर्क करें')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
