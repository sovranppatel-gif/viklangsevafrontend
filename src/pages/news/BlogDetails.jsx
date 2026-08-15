import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingState from '../../components/ui/LoadingState'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { fetchBlogBySlugCms } from '../../services/cms'
import { formatDate } from '../../utils/format'
import { mediaUrl } from '../../utils/media'

export default function BlogDetails() {
  const { slug } = useParams()
  const { isHi } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const post = await fetchBlogBySlugCms(slug)
        if (!cancelled) setData(post)
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

  if (!data || data.isActive === false) {
    return (
      <div className="container-page section-padding">
        <EmptyState title="Article not found" />
        <div className="mt-6 text-center">
          <Link to="/news/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHero
        label={pick(data.category, data.categoryHi)}
        title={pick(data.title, data.titleHi)}
        description={pick(data.excerpt, data.excerptHi)}
        image={data.image}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Blog', to: '/news/blog' },
          { label: pick(data.title, data.titleHi) },
        ]}
      />
      <section className="section-padding">
        <article className="container-page max-w-3xl">
          <time dateTime={data.date} className="text-sm text-text-muted">
            {formatDate(data.date)}
          </time>
          <img
            src={mediaUrl(data.image)}
            alt={pick(data.title, data.titleHi)}
            className="mt-6 h-80 w-full rounded-3xl object-cover"
            loading="lazy"
          />
          <p className="mt-8 text-lg leading-relaxed text-text-muted">
            {pick(data.content, data.contentHi)}
          </p>
        </article>
      </section>
    </>
  )
}
