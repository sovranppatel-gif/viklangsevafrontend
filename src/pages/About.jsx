import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AboutSection from '../components/AboutSection'
import PageHero from '../components/ui/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_ABOUT } from '../data/aboutDefaults'
import { fetchAboutContent } from '../services/cms'

export default function About() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_ABOUT['about-hub'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('about-hub').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_ABOUT['about-hub'], ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <>
      <PageHero
        label={pick(content.heroLabel, content.heroLabelHi)}
        title={pick(content.heroTitle, content.heroTitleHi)}
        description={pick(content.heroDescription, content.heroDescriptionHi)}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: pick(content.heroLabel, content.heroLabelHi) || 'About' },
        ]}
      />
      <AboutSection />
      {content.isActive !== false ? (
        <section className="section-padding bg-muted">
          <div className="container-page grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(content.cards || []).map((item) => (
              <Link key={item.to || item.title} to={item.to || '/about'} className="card card-hover">
                <h3 className="text-lg font-bold text-navy">{pick(item.title, item.titleHi)}</h3>
                <p className="mt-2 text-sm text-text-muted">
                  {pick(item.description, item.descriptionHi)}
                </p>
                <span className="link-arrow mt-4">
                  {pick(content.exploreLabel, content.exploreLabelHi)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
