import { useEffect, useState } from 'react'
import Gallery from '../../components/Gallery'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_GALLERY } from '../../data/galleryDefaults'
import { fetchGalleryContent } from '../../services/cms'

export default function Photos() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_GALLERY['gallery-photos'])

  useEffect(() => {
    let cancelled = false
    fetchGalleryContent('gallery-photos').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_GALLERY['gallery-photos'], ...data })
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
            { label: 'Gallery', to: '/gallery' },
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Photos' },
          ]}
        />
      ) : null}
      <Gallery showHeader={false} limit={0} />
    </>
  )
}
