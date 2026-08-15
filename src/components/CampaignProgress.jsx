import { motion, useInView } from 'framer-motion'
import { Heart, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_IMPACT } from '../data/impactDefaults'
import { useCountUp } from '../hooks/useCountUp'
import { fetchImpactCampaignCms } from '../services/cms'
import { formatCurrencyINR } from '../utils/format'

export default function CampaignProgress() {
  const { t, isHi } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [campaign, setCampaign] = useState(DEFAULT_IMPACT['impact-campaign'])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchImpactCampaignCms()
        if (!cancelled) setCampaign({ ...DEFAULT_IMPACT['impact-campaign'], ...data })
      } catch {
        if (!cancelled) setCampaign(DEFAULT_IMPACT['impact-campaign'])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const raisedValue = Number(campaign.raised) || 0
  const goalValue = Number(campaign.goal) || 1
  const raised = useCountUp(raisedValue, inView)
  const percent = Math.min(100, Math.round((raisedValue / goalValue) * 100))
  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (campaign.isActive === false) return null

  return (
    <section className="section-padding bg-muted" aria-labelledby="campaign-heading">
      <div className="container-page">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-3xl border border-border bg-white shadow-[0_16px_40px_rgba(11,29,54,0.08)]"
        >
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 md:p-8 lg:p-10">
              <p className="section-label">{t('Active Campaign', 'सक्रिय अभियान')}</p>
              <h2 id="campaign-heading" className="mt-2 text-xl font-bold text-navy sm:text-2xl md:text-3xl">
                {pick(campaign.title, campaign.titleHi)}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
                {pick(campaign.description, campaign.descriptionHi)}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-brand md:text-3xl">
                      {formatCurrencyINR(raised)}
                    </p>
                    <p className="text-sm text-text-muted">
                      {t('raised of', 'एकत्रित — लक्ष्य')} {formatCurrencyINR(goalValue)}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-navy">{percent}%</p>
                </div>
                <div
                  className="h-3 overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t('Campaign progress', 'अभियान प्रगति')}
                >
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${percent}%` } : { width: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-navy">
                  <Users className="h-4 w-4 text-brand" aria-hidden="true" />
                  {campaign.donorsToday} {t('donors today', 'दानकर्ता आज')}
                </span>
                <span className="inline-flex items-center gap-2 font-semibold text-navy">
                  <Heart className="h-4 w-4 text-brand" aria-hidden="true" />
                  {campaign.totalDonors}+ {t('supporters so far', 'समर्थक अब तक')}
                </span>
              </div>

              <Link to={campaign.ctaLink || '/donate?amount=2500&method=upi'} className="btn-primary mt-6 w-full sm:mt-8 sm:w-auto">
                {pick(campaign.ctaLabel, campaign.ctaLabelHi)}
              </Link>
            </div>

            <div className="relative min-h-[180px] bg-navy sm:min-h-[220px] lg:min-h-full">
              <img
                src={campaign.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-accent-yellow uppercase">
                  {pick(campaign.deadlineLabel, campaign.deadlineLabelHi)}
                </p>
                <p className="mt-2 text-lg font-bold leading-snug md:text-xl">
                  {pick(campaign.quote, campaign.quoteHi)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
