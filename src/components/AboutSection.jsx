import { CheckCircle2, Eye, Play, Target, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_ABOUT } from '../data/aboutDefaults'
import { fetchAboutContent } from '../services/cms'

export default function AboutSection() {
  const { t, isHi } = useLanguage()
  const [videoOpen, setVideoOpen] = useState(false)
  const [content, setContent] = useState(DEFAULT_ABOUT['home-about'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('home-about').then((data) => {
      if (!cancelled && data) {
        setContent({ ...DEFAULT_ABOUT['home-about'], ...data })
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!videoOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setVideoOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [videoOpen])

  if (content.isActive === false) return null

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <section id="about" className="section-padding bg-white scroll-mt-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src={content.imageUrl}
              alt={pick(content.imageAlt, content.imageAltHi)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {content.introVideoEmbed ? (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-xl transition hover:scale-105 sm:h-16 sm:w-16"
              aria-label={t('Play organization introduction video', 'संस्थान का परिचय वीडियो चलाएँ')}
            >
              <Play className="ml-0.5 h-5 w-5 fill-current sm:ml-1 sm:h-6 sm:w-6" />
            </button>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">{pick(content.sectionLabel, content.sectionLabelHi)}</p>
          <h2 className="section-title">{pick(content.title, content.titleHi)}</h2>
          <p className="section-desc">{pick(content.body, content.bodyHi)}</p>

          <ul className="mt-6 space-y-3">
            {(content.trustPoints || []).map((point) => {
              const label = pick(point.text, point.textHi)
              return (
                <li key={label} className="flex items-center gap-2 text-sm font-medium text-navy">
                  <CheckCircle2 className="h-5 w-5 text-accent-green" aria-hidden="true" />
                  {label}
                </li>
              )
            })}
          </ul>

          <Link to={content.ctaLink || '/about'} className="link-arrow mt-6">
            {pick(content.ctaLabel, content.ctaLabelHi)}
          </Link>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card card-hover">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Target className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-navy">
                {pick(content.missionTitle, content.missionTitleHi)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pick(content.missionBody, content.missionBodyHi)}
              </p>
            </div>
            <div className="card card-hover">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-navy">
                {pick(content.visionTitle, content.visionTitleHi)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pick(content.visionBody, content.visionBodyHi)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {videoOpen && content.introVideoEmbed ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t('Organization introduction video', 'संस्थान परिचय वीडियो')}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-t-2xl bg-black shadow-2xl sm:rounded-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-navy"
                aria-label={t('Close video', 'वीडियो बंद करें')}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  title={t('Viklang Sewa Sansthan introduction', 'विकलांग सेवा संस्थान परिचय')}
                  src={`${content.introVideoEmbed}?autoplay=1&rel=0`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
