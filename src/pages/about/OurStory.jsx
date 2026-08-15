import { useEffect, useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_ABOUT } from '../../data/aboutDefaults'
import { fetchAboutContent } from '../../services/cms'

export default function OurStory() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_ABOUT['about-story'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('about-story').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_ABOUT['about-story'], ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (content.isActive === false) {
    return (
      <PageHero
        label="Our Story"
        title="Our Story"
        description="This page is currently unavailable."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: 'Our Story' },
        ]}
      />
    )
  }

  return (
    <>
      <PageHero
        label={pick(content.heroLabel, content.heroLabelHi)}
        title={pick(content.heroTitle, content.heroTitleHi)}
        description={pick(content.heroDescription, content.heroDescriptionHi)}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: pick(content.heroLabel, content.heroLabelHi) || 'Our Story' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page max-w-4xl">
          <div className="space-y-6 text-base leading-relaxed text-text-muted md:text-lg">
            {(content.paragraphs || []).map((para, index) => (
              <p key={`story-p-${index}`}>{pick(para.body, para.bodyHi)}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
