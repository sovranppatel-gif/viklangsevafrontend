import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import { createDonationAdmin } from '../../../services/donations'
import { CmsField, CmsToast, cmsInputClass, cmsTextareaClass } from './cms/CmsUi'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  amount: '',
  frequency: 'once',
  method: 'cash',
  source: 'office',
  status: 'confirmed',
  pan: '',
  address: '',
  receiptNumber: '',
  notes: '',
  donationDate: new Date().toISOString().slice(0, 10),
  paidConfirm: true,
}

export default function CreateDonorPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const payload = {
        ...form,
        amount: Number(form.amount),
        paidConfirm: true,
      }
      const result = await createDonationAdmin(payload, token)
      setToast(result?.message || 'Donor entry created successfully.')
      setTimeout(() => {
        navigate('/master-admin/donations')
      }, 700)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create donor entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Donations Management</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Create Donor</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Add a full donation entry for someone who donated directly at the office.
          </p>
        </div>
        <Link
          to="/master-admin/donations"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Donors
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Donor details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Full name">
              <input
                className={cmsInputClass}
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="Phone / WhatsApp">
              <input
                className={cmsInputClass}
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
            </CmsField>
            <CmsField label="Email (for 80G)">
              <input
                type="email"
                className={cmsInputClass}
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </CmsField>
            <CmsField label="PAN (optional)">
              <input
                className={cmsInputClass}
                value={form.pan}
                onChange={(e) => setField('pan', e.target.value.toUpperCase())}
                maxLength={20}
              />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="Address">
                <textarea
                  className={cmsTextareaClass}
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  rows={3}
                />
              </CmsField>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Donation details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Amount (₹)">
              <input
                type="number"
                min="1"
                className={cmsInputClass}
                value={form.amount}
                onChange={(e) => setField('amount', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="Donation date">
              <input
                type="date"
                className={cmsInputClass}
                value={form.donationDate}
                onChange={(e) => setField('donationDate', e.target.value)}
                required
              />
            </CmsField>
            <CmsField label="Payment method">
              <select
                className={cmsInputClass}
                value={form.method}
                onChange={(e) => setField('method', e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="other">Other</option>
              </select>
            </CmsField>
            <CmsField label="Frequency">
              <select
                className={cmsInputClass}
                value={form.frequency}
                onChange={(e) => setField('frequency', e.target.value)}
              >
                <option value="once">One-time</option>
                <option value="monthly">Monthly</option>
              </select>
            </CmsField>
            <CmsField label="Source">
              <select
                className={cmsInputClass}
                value={form.source}
                onChange={(e) => setField('source', e.target.value)}
              >
                <option value="office">Office</option>
                <option value="website">Website</option>
              </select>
            </CmsField>
            <CmsField label="Status">
              <select
                className={cmsInputClass}
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                <option value="confirmed">Confirmed</option>
                <option value="new">New</option>
                <option value="receipt_sent">Receipt sent</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </CmsField>
            <CmsField label="Receipt number">
              <input
                className={cmsInputClass}
                value={form.receiptNumber}
                onChange={(e) => setField('receiptNumber', e.target.value)}
                placeholder="e.g. VSS-80G-001"
              />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="Notes">
                <textarea
                  className={cmsTextareaClass}
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  rows={3}
                  placeholder="Cheque no., collected by, remarks…"
                />
              </CmsField>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Link
            to="/master-admin/donations"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save donor'}
          </button>
        </div>
      </form>
    </div>
  )
}
