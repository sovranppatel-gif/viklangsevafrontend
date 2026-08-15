import { useEffect, useState } from 'react'
import Programs from '../components/Programs'
import PageHero from '../components/ui/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_PROGRAMS } from '../data/programsDefaults'
import { fetchProgramsContent } from '../services/cms'

export default function ProgramsPage() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_PROGRAMS['programs-hub'])

  useEffect(() => {
    let cancelled = false
    fetchProgramsContent('programs-hub').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_PROGRAMS['programs-hub'], ...data })
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
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Programs' },
          ]}
        />
      ) : null}
      <Programs />
    </>
  )
}
