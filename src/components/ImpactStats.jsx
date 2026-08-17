import {
  Activity,
  Award,
  GraduationCap,
  HeartHandshake,
  Users,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useCountUp } from '../hooks/useCountUp'
import { fetchImpactStatsCms } from '../services/cms'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LoadingState from './ui/LoadingState'

const iconMap = {
  HeartHandshake,
  GraduationCap,
  Activity,
  Users,
  Award,
}

function StatItem({ stat, active, isHi }) {
  const value = useCountUp(Number(stat.value) || 0, active)
  const Icon = iconMap[stat.icon] || HeartHandshake

  return (
    <div className="flex min-w-[42%] snap-start flex-col items-center px-2 py-2 text-center sm:min-w-0 sm:py-3">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand sm:mb-3 sm:h-12 sm:w-12">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </div>
      <p className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-1 text-[11px] leading-snug font-medium text-text-muted sm:text-xs md:text-sm">
        {isHi && stat.labelHi ? stat.labelHi : stat.label}
      </p>
    </div>
  )
}

export default function ImpactStats() {
  const { isHi, t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const stats = await fetchImpactStatsCms()
        if (!cancelled) setData(Array.isArray(stats) ? stats : [])
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

  return (
    <section className="relative z-10 -mt-12 px-3 sm:-mt-16 sm:px-4 md:-mt-20" aria-label="Impact statistics">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container-page rounded-2xl border border-border bg-white p-3 shadow-[0_20px_50px_rgba(11,29,54,0.12)] sm:rounded-3xl sm:p-4 md:p-6"
      >
        {loading ? <LoadingState label={t('Loading impact numbers…', 'प्रभाव आँकड़े लोड हो रहे हैं…')} /> : null}
        {error ? <ErrorState title={t('Unable to load statistics', 'आँकड़े लोड नहीं हो सके')} /> : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <EmptyState title={t('Impact numbers coming soon', 'प्रभाव आँकड़े जल्द आ रहे हैं')} />
        ) : null}
        {!loading && !error && data?.length ? (
          <div className="-mx-1 flex snap-x snap-mandatory gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible sm:pb-0 md:grid-cols-5 md:gap-4">
            {data.map((stat) => (
              <StatItem key={stat.id} stat={stat} active={inView} isHi={isHi} />
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
