import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  Loader2,
  Save,
  Upload,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchHeroContent,
  updateHeroContent,
  uploadHeroImage,
} from '../../../../services/cms'
import { mediaUrl } from '../../../../utils/media'

const emptyForm = {
  imageUrl: '',
  imageAlt: '',
  imageAltHi: '',
  eyebrow: '',
  eyebrowHi: '',
  title: '',
  titleHi: '',
  headline: '',
  headlineHi: '',
  description: '',
  descriptionHi: '',
  primaryCtaLabel: '',
  primaryCtaLabelHi: '',
  primaryCtaLink: '',
  secondaryCtaLabel: '',
  secondaryCtaLabelHi: '',
  secondaryCtaLink: '',
  isActive: true,
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-navy">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-text-muted">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15'
const textareaClass = `${inputClass} min-h-[88px] resize-y`

function isLocalUpload(url = '') {
  return String(url).includes('/uploads/')
}

export default function HeroCmsPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('url')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!success) return undefined
    const timer = setTimeout(() => setSuccess(''), 2500)
    return () => clearTimeout(timer)
  }, [success])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchHeroContent()
        if (cancelled) return
        setForm({ ...emptyForm, ...data })
        setUpdatedAt(data?.updatedAt || null)
        setImageMode(isLocalUpload(data?.imageUrl) ? 'upload' : 'url')
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              (err?.code === 'ERR_NETWORK'
                ? 'Cannot reach server. Make sure the API is running.'
                : 'Failed to load hero content.'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setSuccess('')
    setError('')
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP or GIF).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const token = getMasterAdminToken()
      const result = await uploadHeroImage(file, token)
      if (!result?.success || !result?.data?.imageUrl) {
        setError(result?.message || 'Upload failed.')
        return
      }
      setForm((prev) => ({ ...prev, imageUrl: result.data.imageUrl }))
      setUpdatedAt(result.data?.updatedAt || new Date().toISOString())
      setSuccess(result.message || 'Image uploaded successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!String(form.imageUrl || '').trim()) {
      setError('Please upload a photo or paste an image URL.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = getMasterAdminToken()
      const result = await updateHeroContent(form, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      setForm({ ...emptyForm, ...result.data })
      setUpdatedAt(result.data?.updatedAt || new Date().toISOString())
      setSuccess(result.message || 'Hero section updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save hero content.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading hero content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {success ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-[80] w-[min(100%-2rem,22rem)] rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg shadow-navy/10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="flex-1 text-sm font-medium text-emerald-800">{success}</p>
            <button
              type="button"
              onClick={() => setSuccess('')}
              className="rounded-md p-1 text-emerald-700/70 transition hover:bg-emerald-50 hover:text-emerald-900"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">Manage CMS</p>
          <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Home Hero Section</h2>
          <p className="mt-1 text-sm text-text-muted">
            Edit the homepage banner text, CTAs and background image.
          </p>
          {updatedAt ? (
            <p className="mt-1 text-xs text-text-muted">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
        >
          View live site
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-lg bg-navy/5 p-2 text-navy">
              <ImageIcon className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-navy">Background image</h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-navy">Image source</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Upload a photo from your device, or paste an image URL.
                </p>
                <div
                  className="mt-2 inline-flex rounded-xl border border-border bg-muted/60 p-1"
                  role="tablist"
                  aria-label="Image source"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={imageMode === 'upload'}
                    onClick={() => setImageMode('upload')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      imageMode === 'upload'
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-text-muted hover:text-navy'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload photo
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={imageMode === 'url'}
                    onClick={() => setImageMode('url')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      imageMode === 'url'
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-text-muted hover:text-navy'
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Image URL
                  </button>
                </div>
              </div>

              {imageMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:border-brand/40 hover:bg-brand-soft/40 disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-brand" />
                    ) : (
                      <Upload className="h-6 w-6 text-navy" />
                    )}
                    <span className="text-sm font-semibold text-navy">
                      {uploading ? 'Uploading...' : 'Click to upload photo'}
                    </span>
                    <span className="text-xs text-text-muted">JPG, PNG, WEBP or GIF · max 5MB</span>
                  </button>
                  {form.imageUrl ? (
                    <p className="mt-2 truncate text-xs text-text-muted">Current: {form.imageUrl}</p>
                  ) : null}
                </div>
              ) : (
                <Field label="Image URL" hint="Paste a full image URL (Unsplash, CDN, or hosted asset).">
                  <input
                    name="imageUrl"
                    type="text"
                    required={imageMode === 'url'}
                    value={form.imageUrl}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Alt text (English)">
                  <input
                    name="imageAlt"
                    value={form.imageAlt}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Alt text (Hindi)">
                  <input
                    name="imageAltHi"
                    value={form.imageAltHi}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {form.imageUrl ? (
                <img
                  src={mediaUrl(form.imageUrl)}
                  alt="Hero preview"
                  className="h-40 w-full object-cover lg:h-full lg:min-h-[160px]"
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-xs text-text-muted lg:min-h-[160px]">
                  No preview
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-base font-bold text-navy">Headline content</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow / tagline (English)">
              <input name="eyebrow" value={form.eyebrow} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Eyebrow / tagline (Hindi)">
              <input
                name="eyebrowHi"
                value={form.eyebrowHi}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Title (English)">
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Title (Hindi)">
              <input name="titleHi" value={form.titleHi} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Headline (English)">
              <textarea
                name="headline"
                value={form.headline}
                onChange={handleChange}
                className={textareaClass}
              />
            </Field>
            <Field label="Headline (Hindi)">
              <textarea
                name="headlineHi"
                value={form.headlineHi}
                onChange={handleChange}
                className={textareaClass}
              />
            </Field>
            <Field label="Description (English)">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={textareaClass}
              />
            </Field>
            <Field label="Description (Hindi)">
              <textarea
                name="descriptionHi"
                value={form.descriptionHi}
                onChange={handleChange}
                className={textareaClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-base font-bold text-navy">Call to action buttons</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button label (English)">
              <input
                name="primaryCtaLabel"
                value={form.primaryCtaLabel}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Primary button label (Hindi)">
              <input
                name="primaryCtaLabelHi"
                value={form.primaryCtaLabelHi}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Primary button link" hint="Example: /donate?amount=1000&method=upi">
              <input
                name="primaryCtaLink"
                value={form.primaryCtaLink}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <div className="hidden sm:block" />
            <Field label="Secondary button label (English)">
              <input
                name="secondaryCtaLabel"
                value={form.secondaryCtaLabel}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Secondary button label (Hindi)">
              <input
                name="secondaryCtaLabelHi"
                value={form.secondaryCtaLabelHi}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Secondary button link" hint="Example: /impact/stories">
              <input
                name="secondaryCtaLink"
                value={form.secondaryCtaLink}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-navy">
            <input
              type="checkbox"
              name="isActive"
              checked={Boolean(form.isActive)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border accent-brand"
            />
            <span className="font-semibold">Show this hero section on the homepage</span>
          </label>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save hero section'}
          </button>
        </div>
      </form>
    </div>
  )
}
