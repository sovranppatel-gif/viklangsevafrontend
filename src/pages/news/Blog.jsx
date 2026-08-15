import { useEffect, useState } from 'react'
import BlogSection from '../../components/BlogSection'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_BLOG } from '../../data/blogDefaults'
import { fetchBlogContent } from '../../services/cms'

export default function Blog() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_BLOG['news-blog'])

  useEffect(() => {
    let cancelled = false
    fetchBlogContent('news-blog').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_BLOG['news-blog'], ...data })
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
            { label: 'News & Events', to: '/news' },
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Blog' },
          ]}
        />
      ) : null}
      <BlogSection />
    </>
  )
}
