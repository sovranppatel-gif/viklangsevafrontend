import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import PageHero from '../components/ui/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { fetchProgramBySlugCms } from '../services/cms'
import { mediaUrl } from '../utils/media'

export default function ProgramDetails() {
  const { slug } = useParams()
  const { isHi } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const program = await fetchProgramBySlugCms(slug)
        if (!cancelled) setData(program)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (loading) {
    return (
      <div className="container-page section-padding">
        <LoadingState label="Loading program details…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-page section-padding">
        <ErrorState title="Unable to load this program" />
      </div>
    )
  }

  if (!data || data.isActive === false) {
    return (
      <div className="container-page section-padding">
        <EmptyState
          title="Program not found"
          description="The program you are looking for may have been moved."
        />
        <div className="mt-6 text-center">
          <Link to="/programs" className="btn-primary">
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHero
        label="Program"
        title={pick(data.title, data.titleHi)}
        description={pick(data.shortDescription, data.shortDescriptionHi)}
        image={data.image}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Programs', to: '/programs' },
          { label: pick(data.title, data.titleHi) },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <img
            src={mediaUrl(data.image)}
            alt={pick(data.title, data.titleHi)}
            className="h-80 w-full rounded-3xl object-cover shadow-lg"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-bold text-navy">
              {pick(data.aboutHeading, data.aboutHeadingHi) || 'About This Program'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {pick(data.description, data.descriptionHi)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={data.primaryCtaLink || '/donate'} className="btn-primary">
                {pick(data.primaryCtaLabel, data.primaryCtaLabelHi) || 'Support This Program'}
              </Link>
              <Link
                to={data.secondaryCtaLink || '/get-involved/volunteer'}
                className="btn-outline"
              >
                {pick(data.secondaryCtaLabel, data.secondaryCtaLabelHi) || 'Volunteer With Us'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
