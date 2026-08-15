import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogSection from '../../components/BlogSection'
import Events from '../../components/Events'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_BLOG } from '../../data/blogDefaults'
import { fetchBlogContent } from '../../services/cms'

export default function NewsHub() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_BLOG['news-hub'])

  useEffect(() => {
    let cancelled = false
    fetchBlogContent('news-hub').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_BLOG['news-hub'], ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <>
      {content.isActive !== false ? (
        <PageHero
          label={pick(content.heroLabel, content.heroLabelHi)}
          title={pick(content.heroTitle, content.heroTitleHi)}
          description={pick(content.heroDescription, content.heroDescriptionHi)}
          crumbs={[
            { label: 'Home', to: '/' },
            { label: pick(content.heroLabel, content.heroLabelHi) || 'News & Events' },
          ]}
        />
      ) : null}
      <section className="section-padding bg-muted">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {(content.cards || []).map((item) => (
            <Link key={item.to || item.title} to={item.to || '/news'} className="card card-hover">
              <h3 className="text-lg font-bold text-navy">{pick(item.title, item.titleHi)}</h3>
              <span className="link-arrow mt-4">
                {pick(content.openLabel, content.openLabelHi)}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <BlogSection />
      <Events />
    </>
  )
}
