import { ExternalLink, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import { mergeDonateSettings } from '../../../data/donateSettingsDefaults'
import {
  fetchDonateSettings,
  updateDonateSettings,
  uploadDonateQrImage,
} from '../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './cms/CmsUi'

const emptyForm = mergeDonateSettings()

export default function DonateSettingsPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchDonateSettings()
        if (cancelled) return
        setForm(mergeDonateSettings(data))
        setUpdatedAt(data?.updatedAt || null)
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              (err?.code === 'ERR_NETWORK'
                ? 'Cannot reach server. Make sure the API is running.'
                : 'Failed to load donate settings.'),
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

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      if (!token) {
        const message = 'Please log in again, then upload the QR image.'
        setError(message)
        throw new Error(message)
      }
      const result = await uploadDonateQrImage(file, token)
      const imageUrl = result?.data?.imageUrl
      if (imageUrl) setField('qrImageUrl', imageUrl)
      setToast(result?.message || 'QR image uploaded.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload QR image.')
      throw err
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const { updatedAt: _ignored, key: _key, ...payload } = form
      const result = await updateDonateSettings(payload, token)
      const data = mergeDonateSettings(result?.data || payload)
      setForm(data)
      setUpdatedAt(result?.data?.updatedAt || new Date().toISOString())
      setToast(result?.message || 'Donate page updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save donate settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading donate page settings…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Donations</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Donate Page</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Manage UPI ID, QR code, bank details and text shown on the landing donate section and
            /donate page.
          </p>
          {updatedAt ? (
            <p className="mt-2 text-xs text-text-muted">
              Last updated: {new Date(updatedAt).toLocaleString('en-IN')}
            </p>
          ) : null}
        </div>
        <Link
          to="/donate"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" />
          View Donate page
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="UPI & QR code">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="UPI ID" hint="Shown on landing and donate page">
              <input
                className={cmsInputClass}
                value={form.upiId}
                onChange={(e) => setField('upiId', e.target.value)}
                placeholder="9424645321@upi"
              />
            </CmsField>
            <CmsField label="Payee name">
              <input
                className={cmsInputClass}
                value={form.upiName}
                onChange={(e) => setField('upiName', e.target.value)}
              />
            </CmsField>
            <div className="sm:col-span-2">
              <ImageSourcePicker
                label="QR code image"
                value={form.qrImageUrl}
                uploading={uploading}
                onChange={(value) => setField('qrImageUrl', value)}
                onUpload={handleUpload}
                cropAspect={1}
                lockCropAspect
                previewClassName="mx-auto h-48 w-48 bg-white object-contain p-3"
              />
              <p className="mt-2 text-xs text-text-muted">
                Upload your UPI QR. If left empty, a QR is generated automatically from the UPI ID.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Bank details">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Account holder name">
              <input
                className={cmsInputClass}
                value={form.accountName}
                onChange={(e) => setField('accountName', e.target.value)}
              />
            </CmsField>
            <CmsField label="Bank name">
              <input
                className={cmsInputClass}
                value={form.bankName}
                onChange={(e) => setField('bankName', e.target.value)}
              />
            </CmsField>
            <CmsField label="Account number">
              <input
                className={cmsInputClass}
                value={form.accountNumber}
                onChange={(e) => setField('accountNumber', e.target.value)}
              />
            </CmsField>
            <CmsField label="IFSC">
              <input
                className={cmsInputClass}
                value={form.ifsc}
                onChange={(e) => setField('ifsc', e.target.value)}
              />
            </CmsField>
            <CmsField label="Branch">
              <input
                className={cmsInputClass}
                value={form.branch}
                onChange={(e) => setField('branch', e.target.value)}
              />
            </CmsField>
            <CmsField label="Payment note (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.note}
                onChange={(e) => setField('note', e.target.value)}
              />
            </CmsField>
            <CmsField label="Payment note (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.noteHi}
                onChange={(e) => setField('noteHi', e.target.value)}
              />
            </CmsField>
          </div>
        </SectionCard>

        <SectionCard title="Landing page donate section">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Title (English)">
              <input
                className={cmsInputClass}
                value={form.landingTitle}
                onChange={(e) => setField('landingTitle', e.target.value)}
              />
            </CmsField>
            <CmsField label="Title (Hindi)">
              <input
                className={cmsInputClass}
                value={form.landingTitleHi}
                onChange={(e) => setField('landingTitleHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Description (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.landingBody}
                onChange={(e) => setField('landingBody', e.target.value)}
              />
            </CmsField>
            <CmsField label="Description (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.landingBodyHi}
                onChange={(e) => setField('landingBodyHi', e.target.value)}
              />
            </CmsField>
          </div>
        </SectionCard>

        <SectionCard title="Donate page text">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Page label (English)">
              <input
                className={cmsInputClass}
                value={form.pageLabel}
                onChange={(e) => setField('pageLabel', e.target.value)}
              />
            </CmsField>
            <CmsField label="Page label (Hindi)">
              <input
                className={cmsInputClass}
                value={form.pageLabelHi}
                onChange={(e) => setField('pageLabelHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Page title (English)">
              <input
                className={cmsInputClass}
                value={form.pageTitle}
                onChange={(e) => setField('pageTitle', e.target.value)}
              />
            </CmsField>
            <CmsField label="Page title (Hindi)">
              <input
                className={cmsInputClass}
                value={form.pageTitleHi}
                onChange={(e) => setField('pageTitleHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Page description (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.pageDescription}
                onChange={(e) => setField('pageDescription', e.target.value)}
              />
            </CmsField>
            <CmsField label="Page description (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.pageDescriptionHi}
                onChange={(e) => setField('pageDescriptionHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Why donate title (English)">
              <input
                className={cmsInputClass}
                value={form.whyTitle}
                onChange={(e) => setField('whyTitle', e.target.value)}
              />
            </CmsField>
            <CmsField label="Why donate title (Hindi)">
              <input
                className={cmsInputClass}
                value={form.whyTitleHi}
                onChange={(e) => setField('whyTitleHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Why donate body (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.whyBody}
                onChange={(e) => setField('whyBody', e.target.value)}
              />
            </CmsField>
            <CmsField label="Why donate body (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.whyBodyHi}
                onChange={(e) => setField('whyBodyHi', e.target.value)}
              />
            </CmsField>
          </div>
        </SectionCard>

        <SectionCard title="80G notices">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="80G title (English)">
              <input
                className={cmsInputClass}
                value={form.form80gTitle}
                onChange={(e) => setField('form80gTitle', e.target.value)}
              />
            </CmsField>
            <CmsField label="80G title (Hindi)">
              <input
                className={cmsInputClass}
                value={form.form80gTitleHi}
                onChange={(e) => setField('form80gTitleHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="80G notice (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.form80gNotice}
                onChange={(e) => setField('form80gNotice', e.target.value)}
              />
            </CmsField>
            <CmsField label="80G notice (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.form80gNoticeHi}
                onChange={(e) => setField('form80gNoticeHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="80G short text (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.form80gShort}
                onChange={(e) => setField('form80gShort', e.target.value)}
              />
            </CmsField>
            <CmsField label="80G short text (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.form80gShortHi}
                onChange={(e) => setField('form80gShortHi', e.target.value)}
              />
            </CmsField>
            <CmsField label="Success message (English)">
              <textarea
                className={cmsTextareaClass}
                value={form.successMessage}
                onChange={(e) => setField('successMessage', e.target.value)}
              />
            </CmsField>
            <CmsField label="Success message (Hindi)">
              <textarea
                className={cmsTextareaClass}
                value={form.successMessageHi}
                onChange={(e) => setField('successMessageHi', e.target.value)}
              />
            </CmsField>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save donate page'}
          </button>
        </div>
      </form>
    </div>
  )
}
