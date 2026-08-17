import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_HERO_CONTENT } from '../data/heroDefaults'
import { fetchHeroContent } from '../services/cms'
import { mediaUrl } from '../utils/media'
import { TrustStrip } from './donation/DonationWidgets'

export default function Hero() {
  const { t, isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_HERO_CONTENT)

  useEffect(() => {
    let cancelled = false
    fetchHeroContent().then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_HERO_CONTENT, ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (content.isActive === false) return null

  const pick = (en, hi) => (isHi && hi ? hi : en)

  return (
    <section
      id="home"
      className="relative isolate min-h-[min(100svh,720px)] overflow-hidden sm:min-h-[620px] md:min-h-[720px]"
    >
      <img
        src={mediaUrl(content.imageUrl)}
        alt={pick(content.imageAlt, content.imageAltHi)}
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/88 to-navy/70 sm:bg-gradient-to-r sm:from-navy sm:via-navy/88 sm:to-navy/45"
        aria-hidden="true"
      />
      <div className="container-page relative flex min-h-[min(100svh,720px)] items-end pb-24 pt-16 sm:min-h-[620px] sm:items-center sm:py-20 md:min-h-[720px]">
        <div className="w-full max-w-2xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-semibold tracking-[0.16em] text-accent-yellow uppercase sm:text-xs sm:tracking-[0.18em] md:text-sm"
          >
            {pick(content.eyebrow, content.eyebrowHi)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 text-[1.85rem] font-bold leading-[1.15] tracking-tight break-words sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.75rem]"
          >
            {pick(content.title, content.titleHi)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-4 max-w-xl text-base font-semibold leading-snug text-white sm:mt-5 sm:text-lg md:text-xl"
          >
            {pick(content.headline, content.headlineHi)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
          >
            {pick(content.description, content.descriptionHi)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex w-full min-w-0 flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
          >
            <Link to={content.primaryCtaLink || '/donate'} className="btn-primary sm:px-8 sm:text-base">
              {t(content.primaryCtaLabel, content.primaryCtaLabelHi)}
            </Link>
            <Link
              to={content.secondaryCtaLink || '/impact/stories'}
              className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-white/90 underline-offset-4 transition hover:text-accent-yellow hover:underline sm:justify-start"
            >
              {t(content.secondaryCtaLabel, content.secondaryCtaLabelHi)}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 min-w-0 text-white/90 sm:mt-8"
          >
            <TrustStrip className="text-[11px] text-white/90 sm:text-sm [&_svg]:text-accent-yellow" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
