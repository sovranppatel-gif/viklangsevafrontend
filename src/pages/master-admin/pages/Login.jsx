import { Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  clearMasterAdminSession,
  fetchMasterAdminMe,
  getMasterAdminToken,
  isMasterAdminAuthenticated,
  loginMasterAdmin,
  setMasterAdminSession,
} from '../data/auth'

export default function MasterAdminLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: 'vss.about@gmail.com',
    password: '',
  })

  useEffect(() => {
    if (searchParams.get('reason') === 'session') {
      setError('Your previous login is not valid on this local server. Please sign in again.')
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    async function checkExistingSession() {
      if (!isMasterAdminAuthenticated()) return
      try {
        await fetchMasterAdminMe(getMasterAdminToken())
        if (!cancelled) navigate('/master-admin/dashboard', { replace: true })
      } catch {
        clearMasterAdminSession()
      }
    }

    checkExistingSession()
    return () => {
      cancelled = true
    }
  }, [navigate])

  function handleChange(e) {
    const { name, value } = e.target
    setError('')
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await loginMasterAdmin(form.email, form.password)
      if (!data?.success || !data?.token) {
        setError(data?.message || 'Invalid email or password.')
        return
      }

      setMasterAdminSession(data.token, data.user)
      navigate('/master-admin/dashboard')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.code === 'ERR_NETWORK'
          ? 'Cannot reach API. If this is the Vercel site, the server must allow this frontend URL (CORS). Redeploy both apps after env changes.'
          : 'Invalid email or password.')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30">
          <User className="h-8 w-8 text-white" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Master Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Viklang Sewa Sansthan
        </h1>
        <p className="mt-2 text-sm text-white/65">Sign in to manage the platform</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2.5 text-sm text-navy">
          <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
          <span className="font-medium">Secure master admin access</span>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-navy">Email</span>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="vss.about@gmail.com"
              className="w-full rounded-xl border border-border bg-muted/40 py-3 pr-3 pl-10 text-sm text-text outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-navy">Password</span>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-border bg-muted/40 py-3 pr-11 pl-10 text-sm text-text outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-text-muted transition hover:text-navy"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error ? (
          <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand">{error}</p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-text-muted">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-brand accent-brand"
            />
            Remember me
          </label>
          <span className="cursor-default text-brand/70">Forgot password?</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full rounded-xl py-3.5 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        <Link to="/" className="transition hover:text-white">
          ← Back to website
        </Link>
      </p>
    </div>
  )
}
