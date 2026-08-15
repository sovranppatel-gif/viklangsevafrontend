import { Download, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_REPORTS } from '../data/reportsDefaults'
import { fetchReportItemsCms, fetchReportsContent } from '../services/cms'
import { mediaUrl } from '../utils/media'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'
import SectionHeader from './ui/SectionHeader'

export default function Reports({ showViewAll = true }) {
  const { isHi } = useLanguage()
  const [section, setSection] = useState(DEFAULT_REPORTS['home-reports'])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [sectionData, items] = await Promise.all([
          fetchReportsContent('home-reports'),
          fetchReportItemsCms(),
        ])
        if (cancelled) return
        setSection({ ...DEFAULT_REPORTS['home-reports'], ...sectionData })
        setData(Array.isArray(items) ? items : [])
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
    <section className="section-padding bg-muted">
      <div className="container-page">
        <SectionHeader
          label={pick(section.sectionLabel, section.sectionLabelHi)}
          title={pick(section.title, section.titleHi)}
          description={pick(section.description, section.descriptionHi)}
        />

        {loading ? <LoadingState label="Loading documents…" /> : null}
        {error ? <ErrorState title="Unable to load documents" /> : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <EmptyState title="Documents will be available soon" />
        ) : null}

        {!loading && !error && data?.length ? (
          <div className="flex flex-wrap justify-center gap-4">
            {data.map((doc) => {
              const hasFile = Boolean(doc.fileUrl) && !doc.placeholder && doc.fileUrl !== '#'
              const href = hasFile ? mediaUrl(doc.fileUrl) : section.viewAllLink || '/reports'
              return (
                <article
                  key={doc.id}
                  className="card card-hover flex w-full max-w-sm flex-col text-center sm:max-w-none sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] xl:w-[calc((100%-5rem)/6)]"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-navy">
                    {pick(doc.title, doc.titleHi)}
                  </h3>
                  <p className="mt-2 min-h-[3.75rem] flex-1 text-xs leading-relaxed text-text-muted">
                    {pick(doc.description, doc.descriptionHi)}
                  </p>
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    <a
                      href={href}
                      target={hasFile ? '_blank' : undefined}
                      rel={hasFile ? 'noreferrer' : undefined}
                      className="btn-outline px-3 py-2 text-xs"
                      aria-disabled={!hasFile}
                    >
                      {pick(section.viewPdfLabel, section.viewPdfLabelHi)}
                    </a>
                    <a
                      href={href}
                      download={hasFile || undefined}
                      target={hasFile ? '_blank' : undefined}
                      rel={hasFile ? 'noreferrer' : undefined}
                      className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-navy hover:text-brand"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      {pick(section.downloadLabel, section.downloadLabelHi)}
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {showViewAll ? (
          <div className="mt-8 text-center">
            <Link to={section.viewAllLink || '/reports'} className="link-arrow">
              {pick(section.viewAllLabel, section.viewAllLabelHi)}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
