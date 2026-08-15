import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_BLOG } from '../data/blogDefaults'
import { fetchBlogArticles, fetchBlogContent } from '../services/cms'
import { formatDate } from '../utils/format'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

export default function BlogSection() {
  const { isHi } = useLanguage()
  const [section, setSection] = useState(DEFAULT_BLOG['home-blog'])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, articles] = await Promise.all([
          fetchBlogContent('home-blog'),
          fetchBlogArticles(),
        ])
        if (cancelled) return
        setSection({ ...DEFAULT_BLOG['home-blog'], ...sectionData })
        setData(Array.isArray(articles) ? articles : [])
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

  if (section.isActive === false) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={pick(section.sectionLabel, section.sectionLabelHi)}
            title={pick(section.title, section.titleHi)}
            description={pick(section.description, section.descriptionHi)}
            align="left"
            className="mb-0 md:mb-0"
          />
          <Link to={section.viewAllLink || '/news/blog'} className="link-arrow shrink-0 md:mb-2">
            {pick(section.viewAllLabel, section.viewAllLabelHi)}
          </Link>
        </div>

        {loading ? <LoadingState label="Loading articles…" /> : null}
        {error ? <ErrorState title="Unable to load articles" /> : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <EmptyState title="No articles published yet" />
        ) : null}

        {!loading && !error && data?.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {data.map((post, index) => (
              <motion.article
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(11,29,54,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,29,54,0.12)] sm:rounded-3xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={pick(post.title, post.titleHi)}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-52"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide uppercase">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">
                      {pick(post.category, post.categoryHi)}
                    </span>
                    <time dateTime={post.date} className="text-text-muted">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-navy">
                    {pick(post.title, post.titleHi)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {pick(post.excerpt, post.excerptHi)}
                  </p>
                  <Link to={`/news/blog/${post.slug}`} className="link-arrow mt-5">
                    {pick(section.readMoreLabel, section.readMoreLabelHi)}
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
