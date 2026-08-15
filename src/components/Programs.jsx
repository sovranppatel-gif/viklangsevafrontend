import {
  BookOpen,
  Briefcase,
  Handshake,
  HeartPulse,
  Home,
  Stethoscope,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_PROGRAMS } from '../data/programsDefaults'
import { fetchProgramsCatalog, fetchProgramsContent } from '../services/cms'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

const iconMap = {
  BookOpen,
  HeartPulse,
  Briefcase,
  Stethoscope,
  Home,
  Handshake,
}

export default function Programs() {
  const { isHi } = useLanguage()
  const [section, setSection] = useState(DEFAULT_PROGRAMS['home-programs'])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, catalog] = await Promise.all([
          fetchProgramsContent('home-programs'),
          fetchProgramsCatalog(),
        ])
        if (cancelled) return
        setSection({ ...DEFAULT_PROGRAMS['home-programs'], ...sectionData })
        setData(Array.isArray(catalog) ? catalog : [])
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
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (section.isActive === false) return null

  return (
    <section id="programs" className="section-padding bg-muted scroll-mt-28">
      <div className="container-page">
        <SectionHeader
          label={pick(section.sectionLabel, section.sectionLabelHi)}
          title={pick(section.title, section.titleHi)}
          description={pick(section.description, section.descriptionHi)}
        />

        {loading ? <LoadingState label="Loading programs…" /> : null}
        {error ? <ErrorState title="Unable to load programs" /> : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <EmptyState title="Programs will appear here soon" />
        ) : null}

        {!loading && !error && data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((program, index) => {
              const Icon = iconMap[program.icon] || BookOpen
              return (
                <motion.article
                  key={program.id || program.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card card-hover group"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-md transition group-hover:scale-105">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-navy">
                    {pick(program.title, program.titleHi)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {pick(program.shortDescription, program.shortDescriptionHi)}
                  </p>
                  <Link to={`/programs/${program.slug}`} className="link-arrow mt-5">
                    {pick(section.readMoreLabel, section.readMoreLabelHi)}
                  </Link>
                </motion.article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
