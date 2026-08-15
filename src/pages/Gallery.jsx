import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Gallery from '../components/Gallery'
import PageHero from '../components/ui/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_GALLERY } from '../data/galleryDefaults'
import { fetchGalleryContent } from '../services/cms'

export default function GalleryPage() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_GALLERY['gallery-hub'])

  useEffect(() => {
    let cancelled = false
    fetchGalleryContent('gallery-hub').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_GALLERY['gallery-hub'], ...data })
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
            { label: pick(content.heroLabel, content.heroLabelHi) || 'Gallery' },
          ]}
        />
      ) : null}
      <section className="section-padding bg-muted">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {(content.cards || []).map((item) => (
            <Link key={item.to || item.title} to={item.to || '/gallery'} className="card card-hover">
              <h3 className="text-xl font-bold text-navy">{pick(item.title, item.titleHi)}</h3>
              <p className="mt-2 text-sm text-text-muted">
                {pick(item.description, item.descriptionHi)}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Gallery />
    </>
  )
}
