import {
  CalendarDays,
  ChevronDown,
  Clock3,
  HandHeart,
  Loader2,
  Mail,
  MapPin,
  Newspaper,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken, getMasterAdminUser } from '../data/auth'
import { fetchDashboard } from '../../../services/dashboard'

const iconMap = {
  handHeart: HandHeart,
  users: Users,
  newspaper: Newspaper,
  calendar: CalendarDays,
  mail: Mail,
  userPlus: UserPlus,
}

const emptyDashboard = {
  stats: [],
  donationTrend: [],
  paymentMethods: [],
  topPrograms: [],
  recentDonations: [],
  upcomingEvents: [],
  recentBlogs: [],
  dateRangeLabel: 'This week',
  notificationCount: 0,
}

function buildSmoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cx = (p0.x + p1.x) / 2
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

function StatCards({ stats }) {
  if (!stats.length) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-sm text-text-muted shadow-sm">
        No stats available yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || HandHeart
        const TrendIcon = stat.changeUp === false ? TrendingDown : TrendingUp
        const trendColor = stat.changeUp === false ? 'text-rose-600' : 'text-emerald-600'
        return (
          <div key={stat.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-muted">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-navy">{stat.value}</p>
              </div>
              <span className={`rounded-xl p-2.5 ${stat.iconBg} ${stat.iconColor}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className={`mt-3 flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
              <TrendIcon className="h-3.5 w-3.5" />
              {stat.changeUp === false ? '↓' : '↑'} {stat.change}{' '}
              <span className="font-normal text-text-muted">{stat.changeLabel}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

function DonationsLineChart({ donationTrend }) {
  const width = 640
  const height = 240
  const padX = 28
  const padY = 28
  const trend =
    donationTrend.length > 0
      ? donationTrend
      : [
          { day: '—', amount: 0 },
          { day: '—', amount: 0 },
        ]
  const max = Math.max(...trend.map((d) => d.amount), 1)
  const min = Math.min(...trend.map((d) => d.amount), 0) * 0.65

  const points = trend.map((d, i) => {
    const x = padX + (i / Math.max(trend.length - 1, 1)) * (width - padX * 2)
    const y = padY + (1 - (d.amount - min) / Math.max(max - min, 1)) * (height - padY * 2)
    return { x, y, ...d }
  })

  const line = buildSmoothPath(points)
  const area = `${line} L ${points[points.length - 1].x} ${height - 12} L ${points[0].x} ${height - 12} Z`

  return (
    <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-navy">Donations Overview</h2>
          <p className="text-xs text-text-muted">Weekly donation trend</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-navy">
          This Week
        </span>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Donations line chart">
          <defs>
            <linearGradient id="donationFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padY + (i / 4) * (height - padY * 2)
            return (
              <line key={i} x1={padX} x2={width - padX} y1={y} y2={y} stroke="#EEF1F6" strokeWidth="1" />
            )
          })}
          <path d={area} fill="url(#donationFill)" />
          <path d={line} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, index) => (
            <circle key={`${p.day}-${index}`} cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#3B82F6" strokeWidth="2.5" />
          ))}
        </svg>
        <div className="mt-1 flex justify-between px-2 text-[10px] text-text-muted sm:text-xs">
          {trend.map((d, index) => (
            <span key={`${d.day}-${index}`}>{d.day}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentDonut({ paymentMethods }) {
  const size = 150
  const stroke = 24
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0
  const methods = paymentMethods.length
    ? paymentMethods
    : [{ label: 'No data', value: 100, color: '#E2E8F0' }]
  const hasData = paymentMethods.some((item) => item.value > 0)

  return (
    <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-navy">Donations by Payment Method</h2>
      <p className="mb-4 text-xs text-text-muted">Share of total donations</p>

      <div className="flex flex-col items-center gap-5">
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label="Payment methods chart">
          {methods.map((item) => {
            const dash = (item.value / 100) * circumference
            const segment = (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            )
            offset += dash
            return segment
          })}
        </svg>

        {hasData ? (
          <ul className="w-full space-y-2.5">
            {paymentMethods.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-text">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="font-semibold text-navy">{item.value}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-text-muted">No donation payments yet.</p>
        )}
      </div>
    </div>
  )
}

function TopPrograms({ topPrograms }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-navy">Top Programs by Donations</h2>
      <p className="mb-4 text-xs text-text-muted">This week&apos;s distribution</p>
      {topPrograms.length ? (
        <ul className="space-y-4">
          {topPrograms.map((p) => (
            <li key={p.name}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-navy">{p.name}</span>
                <span className="shrink-0 text-xs text-text-muted">
                  {p.amount} <span className="font-semibold text-navy">({p.percent}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${p.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-[#F8FAFC] px-3 py-4 text-sm text-text-muted">
          Program-wise donation tracking will appear here once donations are linked to programs.
        </p>
      )}
    </div>
  )
}

function RecentDonations({ recentDonations }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">Recent Donations</h2>
        <Link to="/master-admin/donations" className="text-xs font-semibold text-brand hover:underline">
          View All
        </Link>
      </div>
      {recentDonations.length ? (
        <ul className="space-y-3">
          {recentDonations.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${d.avatarBg}`}
              >
                {d.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{d.name}</p>
                <p className="truncate text-xs text-text-muted">{d.method}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-navy">{d.amount}</p>
                <p className="text-[10px] text-text-muted">{d.datetime}</p>
                <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {d.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-[#F8FAFC] px-3 py-4 text-sm text-text-muted">No donations yet.</p>
      )}
    </div>
  )
}

function UpcomingEvents({ upcomingEvents }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">Upcoming Events</h2>
      </div>
      {upcomingEvents.length ? (
        <ul className="space-y-3">
          {upcomingEvents.map((e) => (
            <li key={e.id} className="flex gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
              <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand text-white">
                <span className="text-lg font-bold leading-none">{e.day}</span>
                <span className="text-[10px] font-semibold tracking-wide">{e.month}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{e.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="h-3 w-3 text-brand" />
                  {e.location}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                  <Clock3 className="h-3 w-3 text-brand" />
                  {e.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-[#F8FAFC] px-3 py-4 text-sm text-text-muted">No upcoming events.</p>
      )}
      <Link
        to="/master-admin/cms/blog/event-items"
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-brand/20 bg-brand-soft py-2.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
      >
        View All Events
      </Link>
    </div>
  )
}

function RecentBlogs({ recentBlogs }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">Recent Blog Posts</h2>
        <Link
          to="/master-admin/cms/blog/blog-articles"
          className="text-xs font-semibold text-brand hover:underline"
        >
          View All
        </Link>
      </div>
      {recentBlogs.length ? (
        <ul className="space-y-3">
          {recentBlogs.map((b) => (
            <li key={b.id} className="flex gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
              {b.image ? (
                <img
                  src={b.image}
                  alt=""
                  className="h-14 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className={`h-14 w-16 shrink-0 rounded-lg bg-gradient-to-br ${b.thumb}`} />
              )}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-navy">{b.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-text-muted">{b.date}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      b.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-[#F8FAFC] px-3 py-4 text-sm text-text-muted">No blog posts yet.</p>
      )}
    </div>
  )
}

export default function MasterAdminDashboard() {
  const [data, setData] = useState(emptyDashboard)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = getMasterAdminUser()
  const adminName = user?.name || user?.email?.split('@')[0] || 'Master Admin'

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const token = getMasterAdminToken()
        const result = await fetchDashboard(token)
        if (cancelled) return
        if (result?.success && result?.data) {
          setData({ ...emptyDashboard, ...result.data })
        } else {
          setError(result?.message || 'Unable to load dashboard.')
        }
      } catch {
        if (!cancelled) setError('Unable to load dashboard. Please check the server connection.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Welcome back, {adminName}!</h2>
          <p className="mt-1 text-sm text-text-muted">
            Here&apos;s what&apos;s happening with Viklang Sewa Sansthan today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-navy shadow-sm">
            <CalendarDays className="h-4 w-4 text-text-muted" />
            {data.dateRangeLabel}
          </span>
          <div className="relative">
            <details className="group">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark">
                Quick Actions
                <ChevronDown className="h-4 w-4" />
              </summary>
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-border bg-white p-2 shadow-xl">
                <Link
                  to="/master-admin/donations/create"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-muted"
                >
                  Create Donor
                </Link>
                <Link
                  to="/master-admin/enquiries"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-muted"
                >
                  View Enquiries
                </Link>
                <Link
                  to="/master-admin/cms/blog/blog-articles"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-muted"
                >
                  Manage Blogs
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <StatCards stats={data.stats} />

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <DonationsLineChart donationTrend={data.donationTrend} />
        </div>
        <PaymentDonut paymentMethods={data.paymentMethods} />
        <TopPrograms topPrograms={data.topPrograms} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentDonations recentDonations={data.recentDonations} />
        <UpcomingEvents upcomingEvents={data.upcomingEvents} />
        <RecentBlogs recentBlogs={data.recentBlogs} />
      </div>
    </div>
  )
}
