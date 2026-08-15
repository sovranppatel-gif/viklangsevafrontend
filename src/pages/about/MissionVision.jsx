import { Eye, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_ABOUT } from '../../data/aboutDefaults'
import { fetchAboutContent } from '../../services/cms'

export default function MissionVision() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_ABOUT['about-mission-vision'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('about-mission-vision').then((data) => {
      if (!cancelled && data) {
        setContent({ ...DEFAULT_ABOUT['about-mission-vision'], ...data })
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (content.isActive === false) {
    return (
      <PageHero
        label="Mission & Vision"
        title="Mission & Vision"
        description="This page is currently unavailable."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: 'Mission & Vision' },
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
          { label: pick(content.heroLabel, content.heroLabelHi) || 'Mission & Vision' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <article className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-navy">
              {pick(content.missionTitle, content.missionTitleHi)}
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              {pick(content.missionBody, content.missionBodyHi)}
            </p>
          </article>
          <article className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-navy">
              {pick(content.visionTitle, content.visionTitleHi)}
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              {pick(content.visionBody, content.visionBodyHi)}
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
