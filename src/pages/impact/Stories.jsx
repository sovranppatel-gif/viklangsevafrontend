import { useEffect, useState } from 'react'
import ImpactStories from '../../components/ImpactStories'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_IMPACT } from '../../data/impactDefaults'
import { fetchImpactContent } from '../../services/cms'

export default function Stories() {
  const { isHi, t } = useLanguage()
  const [hero, setHero] = useState(DEFAULT_IMPACT['stories-hub'])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchImpactContent('stories-hub')
        if (!cancelled) setHero({ ...DEFAULT_IMPACT['stories-hub'], ...data })
      } catch {
        if (!cancelled) setHero(DEFAULT_IMPACT['stories-hub'])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <>
      <PageHero
        label={pick(hero.heroLabel, hero.heroLabelHi)}
        title={pick(hero.heroTitle, hero.heroTitleHi)}
        description={pick(hero.heroDescription, hero.heroDescriptionHi)}
        crumbs={[
          { label: t('Home', 'होम'), to: '/' },
          { label: t('Impact', 'प्रभाव'), to: '/impact' },
          { label: pick(hero.heroLabel, hero.heroLabelHi) },
        ]}
      />
      <ImpactStories hideHeader />
    </>
  )
}
