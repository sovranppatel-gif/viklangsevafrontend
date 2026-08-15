import { HeartHandshake, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_IMPACT } from '../data/impactDefaults'
import { fetchImpactCampaignCms } from '../services/cms'
import { formatCurrencyINR } from '../utils/format'

export default function StickyDonateBar() {
  const { t } = useLanguage()
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [campaign, setCampaign] = useState(DEFAULT_IMPACT['impact-campaign'])

  const hideOnDonate = location.pathname.startsWith('/donate')
  const hideOnAdmin =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/master-admin')

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

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const campaignActive = campaign.isActive !== false
  const show = visible && !dismissed && !hideOnDonate && !hideOnAdmin && campaignActive

  useEffect(() => {
    document.documentElement.classList.toggle('has-sticky-donate', show)
    return () => document.documentElement.classList.remove('has-sticky-donate')
  }, [show])

  const goal = Number(campaign.goal) || 1
  const raised = Number(campaign.raised) || 0
  const percent = Math.min(100, Math.round((raised / goal) * 100))

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-8px_30px_rgba(11,29,54,0.12)] backdrop-blur-md safe-bottom"
        >
          <div className="container-page flex items-center gap-2 py-2.5 sm:gap-3 sm:py-3 md:gap-5">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand sm:flex">
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-navy sm:text-sm">
                {t('Help a child today', 'आज एक बच्चे की मदद करें')}
                <span className="hidden sm:inline">
                  {' '}
                  · {campaign.donorsToday} {t('donors today', 'दानकर्ता आज')}
                </span>
              </p>
              <div className="mt-1.5 flex items-center gap-2 sm:gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                </div>
                <span className="hidden shrink-0 text-xs font-semibold text-text-muted sm:inline">
                  {formatCurrencyINR(raised)} / {formatCurrencyINR(goal)}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-text-muted sm:hidden">
                  {percent}%
                </span>
              </div>
            </div>
            <Link
              to="/donate?amount=1000&method=upi"
              className="btn-primary w-auto shrink-0 px-3.5 py-2.5 text-xs sm:px-4 sm:text-sm"
            >
              {t('Donate', 'दान')}
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-full p-2 text-text-muted hover:bg-muted"
              aria-label={t('Dismiss donate bar', 'दान बार बंद करें')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
