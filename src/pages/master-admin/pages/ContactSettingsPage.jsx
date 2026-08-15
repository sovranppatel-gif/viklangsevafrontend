import { ExternalLink, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import { mergeContactSettings } from '../../../data/contactSettingsDefaults'
import { fetchContactSettings, updateContactSettings } from '../../../services/cms'
import { CmsField, CmsToast, cmsInputClass, cmsTextareaClass } from './cms/CmsUi'

const emptyForm = mergeContactSettings()

export default function ContactSettingsPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchContactSettings()
        if (cancelled) return
        setForm(mergeContactSettings(data))
        setUpdatedAt(data?.updatedAt || null)
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              (err?.code === 'ERR_NETWORK'
                ? 'Cannot reach server. Make sure the API is running.'
                : 'Failed to load contact settings.'),
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

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const setAddress = (key, value) => {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [key]: value },
    }))
  }

  const setSocial = (key, value) => {
    setForm((current) => ({
      ...current,
      social: { ...current.social, [key]: value },
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const { updatedAt: _ignored, key: _key, ...payload } = form
      const result = await updateContactSettings(payload, token)
      const data = mergeContactSettings(result?.data || payload)
      setForm(data)
      setUpdatedAt(result?.data?.updatedAt || new Date().toISOString())
      setToast(result?.message || 'Settings updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading contact settings…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">System Settings</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Contact & Social Profile</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Update address, phone, email and social links shown on Contact, Top bar and Footer.
          </p>
          {updatedAt ? (
            <p className="mt-2 text-xs text-text-muted">
              Last updated: {new Date(updatedAt).toLocaleString('en-IN')}
            </p>
          ) : null}
        </div>
        <Link
          to="/contact"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" />
          View Contact page
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Contact section text</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Section label">
              <input
                className={cmsInputClass}
                value={form.contactLabel}
                onChange={(e) => setField('contactLabel', e.target.value)}
              />
            </CmsField>
            <CmsField label="Section title">
              <input
                className={cmsInputClass}
                value={form.contactTitle}
                onChange={(e) => setField('contactTitle', e.target.value)}
              />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="Section description">
                <textarea
                  className={cmsTextareaClass}
                  value={form.contactDescription}
                  onChange={(e) => setField('contactDescription', e.target.value)}
                />
              </CmsField>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Organization details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Display name">
              <input
                className={cmsInputClass}
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="Tagline">
              <input
                className={cmsInputClass}
                value={form.tagline}
                onChange={(e) => setField('tagline', e.target.value)}
              />
            </CmsField>
            <CmsField label="Short location (Top bar)">
              <input
                className={cmsInputClass}
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
              />
            </CmsField>
            <CmsField label="Phone">
              <input
                className={cmsInputClass}
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="Email">
              <input
                type="email"
                className={cmsInputClass}
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="WhatsApp number" hint="Include country code, e.g. 919424645321">
              <input
                className={cmsInputClass}
                value={form.whatsapp}
                onChange={(e) => setField('whatsapp', e.target.value)}
              />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="Footer description">
                <textarea
                  className={cmsTextareaClass}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </CmsField>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Address line 1">
              <input
                className={cmsInputClass}
                value={form.address.line1}
                onChange={(e) => setAddress('line1', e.target.value)}
              />
            </CmsField>
            <CmsField label="Address line 2">
              <input
                className={cmsInputClass}
                value={form.address.line2}
                onChange={(e) => setAddress('line2', e.target.value)}
              />
            </CmsField>
            <CmsField label="City">
              <input
                className={cmsInputClass}
                value={form.address.city}
                onChange={(e) => setAddress('city', e.target.value)}
              />
            </CmsField>
            <CmsField label="State">
              <input
                className={cmsInputClass}
                value={form.address.state}
                onChange={(e) => setAddress('state', e.target.value)}
              />
            </CmsField>
            <CmsField label="Pincode">
              <input
                className={cmsInputClass}
                value={form.address.pincode}
                onChange={(e) => setAddress('pincode', e.target.value)}
              />
            </CmsField>
            <CmsField label="Country">
              <input
                className={cmsInputClass}
                value={form.address.country}
                onChange={(e) => setAddress('country', e.target.value)}
              />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField
                label="Google Maps embed URL"
                hint="Paste the iframe src URL from Google Maps → Share → Embed"
              >
                <input
                  className={cmsInputClass}
                  value={form.mapEmbedUrl}
                  onChange={(e) => setField('mapEmbedUrl', e.target.value)}
                />
              </CmsField>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Social media links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Facebook">
              <input
                className={cmsInputClass}
                value={form.social.facebook}
                onChange={(e) => setSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </CmsField>
            <CmsField label="Instagram">
              <input
                className={cmsInputClass}
                value={form.social.instagram}
                onChange={(e) => setSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </CmsField>
            <CmsField label="YouTube">
              <input
                className={cmsInputClass}
                value={form.social.youtube}
                onChange={(e) => setSocial('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </CmsField>
            <CmsField label="Twitter / X">
              <input
                className={cmsInputClass}
                value={form.social.twitter}
                onChange={(e) => setSocial('twitter', e.target.value)}
                placeholder="https://x.com/..."
              />
            </CmsField>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
