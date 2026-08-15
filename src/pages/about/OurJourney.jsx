import { useEffect, useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_ABOUT } from '../../data/aboutDefaults'
import { fetchAboutContent } from '../../services/cms'

export default function OurJourney() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_ABOUT['about-journey'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('about-journey').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_ABOUT['about-journey'], ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (content.isActive === false) {
    return (
      <PageHero
        label="Our Journey"
        title="Our Journey"
        description="This page is currently unavailable."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: 'Our Journey' },
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
          { label: pick(content.heroLabel, content.heroLabelHi) || 'Our Journey' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page max-w-3xl space-y-6">
          {(content.milestones || []).map((item) => (
            <article key={item.id || item.year} className="card relative pl-8">
              <span
                className="absolute top-6 left-3 h-3 w-3 rounded-full bg-brand"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">
                {pick(item.year, item.yearHi)}
              </p>
              <h3 className="mt-2 text-xl font-bold text-navy">{pick(item.title, item.titleHi)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pick(item.description, item.descriptionHi)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
