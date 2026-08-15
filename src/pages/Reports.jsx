import { useEffect, useState } from 'react'
import Reports from '../components/Reports'
import PageHero from '../components/ui/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_REPORTS } from '../data/reportsDefaults'
import { fetchReportsContent } from '../services/cms'

export default function ReportsPage() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_REPORTS['reports-hub'])

  useEffect(() => {
    let cancelled = false
    fetchReportsContent('reports-hub').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_REPORTS['reports-hub'], ...data })
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
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Reports & Documents' },
          ]}
        />
      ) : null}
      <Reports showViewAll={false} />
    </>
  )
}
