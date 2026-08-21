import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import {
  createVolunteerAdmin,
  fetchVolunteerById,
  updateVolunteer,
  uploadVolunteerDocumentPublic,
  uploadVolunteerPhoto,
} from '../../../services/volunteers'
import {
  AVAILABILITY_OPTIONS,
  BLOOD_GROUPS,
  VOLUNTEER_DEPARTMENTS,
  VOLUNTEER_STATUSES,
} from '../../../utils/volunteer'
import IdentityDocUpload from '../../../components/volunteer/IdentityDocUpload'
import { CmsField, CmsToast, ImageSourcePicker, cmsInputClass, cmsTextareaClass } from './cms/CmsUi'

const emptyForm = {
  name: '',
  fatherName: '',
  motherName: '',
  gender: '',
  dateOfBirth: '',
  bloodGroup: '',
  photoUrl: '',
  aadhaarNumber: '',
  aadhaarDocumentUrl: '',
  pan: '',
  panDocumentUrl: '',
  email: '',
  phone: '',
  whatsapp: '',
  alternatePhone: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Narsinghpur',
  state: 'Madhya Pradesh',
  pincode: '',
  qualification: '',
  occupation: '',
  skills: '',
  interest: 'Education Support',
  availability: 'As needed',
  joiningDate: new Date().toISOString().slice(0, 10),
  validUntil: '',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',
  notes: '',
  status: 'active',
}

export default function VolunteerFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [uploading, setUploading] = useState(false)
  const [docUploading, setDocUploading] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const token = getMasterAdminToken()
        const result = await fetchVolunteerById(id, token)
        if (cancelled) return
        const data = result?.data || {}
        setForm({
          ...emptyForm,
          ...data,
          aadhaarNumber: data.aadhaarNumber || '',
          whatsapp: data.whatsapp || data.phone || '',
          joiningDate: data.joiningDate || emptyForm.joiningDate,
          status: data.status || 'active',
        })
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Unable to load volunteer.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await uploadVolunteerPhoto(file, token)
      if (!result?.success || !result?.data?.imageUrl) {
        setError(result?.message || 'Photo upload failed.')
        return
      }
      setField('photoUrl', result.data.imageUrl)
      setToast('Photo uploaded.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to upload photo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDocumentUpload = async (field, file) => {
    setDocUploading(field)
    setError('')
    try {
      const result = await uploadVolunteerDocumentPublic(file)
      if (!result?.success || !result?.data?.fileUrl) {
        setError(result?.message || 'Document upload failed.')
        return
      }
      setField(field, result.data.fileUrl)
      setToast('Document uploaded.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to upload document.')
    } finally {
      setDocUploading('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const payload = {
        ...form,
        whatsapp: form.whatsapp || form.phone,
      }
      const result = isEdit
        ? await updateVolunteer(id, payload, token)
        : await createVolunteerAdmin(payload, token)
      setToast(result?.message || 'Volunteer saved.')
      setTimeout(() => navigate('/master-admin/volunteers'), 700)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save volunteer.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading volunteer...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Volunteer</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">
            {isEdit ? 'Edit Volunteer' : 'Add Volunteer'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Complete KYC-style details used for volunteer records and identity cards.
          </p>
        </div>
        <Link
          to="/master-admin/volunteers"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Photo</h2>
          <div className="mt-4 max-w-md">
            <ImageSourcePicker
              label="Volunteer photo"
              value={form.photoUrl}
              uploading={uploading}
              onChange={(value) => setField('photoUrl', value)}
              onUpload={handleUpload}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Personal details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Full name">
              <input className={cmsInputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} required />
            </CmsField>
            <CmsField label="Father's name">
              <input className={cmsInputClass} value={form.fatherName} onChange={(e) => setField('fatherName', e.target.value)} />
            </CmsField>
            <CmsField label="Mother's name">
              <input className={cmsInputClass} value={form.motherName} onChange={(e) => setField('motherName', e.target.value)} />
            </CmsField>
            <CmsField label="Gender">
              <select className={cmsInputClass} value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </CmsField>
            <CmsField label="Date of birth">
              <input type="date" className={cmsInputClass} value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
            </CmsField>
            <CmsField label="Blood group">
              <select className={cmsInputClass} value={form.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Identity</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Aadhaar number" hint="12 digits · shown masked in the list, not printed on ID card">
              <input
                className={cmsInputClass}
                inputMode="numeric"
                maxLength={12}
                value={form.aadhaarNumber}
                onChange={(e) => setField('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
            </CmsField>
            <CmsField label="PAN (optional)">
              <input
                className={cmsInputClass}
                maxLength={10}
                value={form.pan}
                onChange={(e) => setField('pan', e.target.value.toUpperCase())}
              />
            </CmsField>
            <IdentityDocUpload
              label="Aadhaar card upload"
              hint="Front or full card scan"
              value={form.aadhaarDocumentUrl}
              uploading={docUploading === 'aadhaarDocumentUrl'}
              onUpload={(file) => handleDocumentUpload('aadhaarDocumentUrl', file)}
              onError={setError}
            />
            <IdentityDocUpload
              label="PAN card upload"
              hint="Optional"
              value={form.panDocumentUrl}
              uploading={docUploading === 'panDocumentUrl'}
              onUpload={(file) => handleDocumentUpload('panDocumentUrl', file)}
              onError={setError}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Mobile">
              <input className={cmsInputClass} value={form.phone} onChange={(e) => setField('phone', e.target.value)} required />
            </CmsField>
            <CmsField label="WhatsApp">
              <input className={cmsInputClass} value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} />
            </CmsField>
            <CmsField label="Email">
              <input type="email" className={cmsInputClass} value={form.email} onChange={(e) => setField('email', e.target.value)} required />
            </CmsField>
            <CmsField label="Alternate phone">
              <input className={cmsInputClass} value={form.alternatePhone} onChange={(e) => setField('alternatePhone', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <CmsField label="Address line 1">
                <input className={cmsInputClass} value={form.addressLine1} onChange={(e) => setField('addressLine1', e.target.value)} />
              </CmsField>
            </div>
            <div className="sm:col-span-2">
              <CmsField label="Address line 2">
                <input className={cmsInputClass} value={form.addressLine2} onChange={(e) => setField('addressLine2', e.target.value)} />
              </CmsField>
            </div>
            <CmsField label="City">
              <input className={cmsInputClass} value={form.city} onChange={(e) => setField('city', e.target.value)} />
            </CmsField>
            <CmsField label="State">
              <input className={cmsInputClass} value={form.state} onChange={(e) => setField('state', e.target.value)} />
            </CmsField>
            <CmsField label="Pincode">
              <input className={cmsInputClass} value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Volunteer assignment</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="Department">
              <select className={cmsInputClass} value={form.interest} onChange={(e) => setField('interest', e.target.value)}>
                {VOLUNTEER_DEPARTMENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </CmsField>
            <CmsField label="Availability">
              <select className={cmsInputClass} value={form.availability} onChange={(e) => setField('availability', e.target.value)}>
                {AVAILABILITY_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </CmsField>
            <CmsField label="Qualification">
              <input className={cmsInputClass} value={form.qualification} onChange={(e) => setField('qualification', e.target.value)} />
            </CmsField>
            <CmsField label="Occupation">
              <input className={cmsInputClass} value={form.occupation} onChange={(e) => setField('occupation', e.target.value)} />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="Skills">
                <input className={cmsInputClass} value={form.skills} onChange={(e) => setField('skills', e.target.value)} />
              </CmsField>
            </div>
            <CmsField label="Joining date">
              <input type="date" className={cmsInputClass} value={form.joiningDate} onChange={(e) => setField('joiningDate', e.target.value)} />
            </CmsField>
            <CmsField label="ID valid until">
              <input type="date" className={cmsInputClass} value={form.validUntil} onChange={(e) => setField('validUntil', e.target.value)} />
            </CmsField>
            <CmsField label="Status">
              <select className={cmsInputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {VOLUNTEER_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Emergency contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <CmsField label="Name">
              <input className={cmsInputClass} value={form.emergencyName} onChange={(e) => setField('emergencyName', e.target.value)} />
            </CmsField>
            <CmsField label="Phone">
              <input className={cmsInputClass} value={form.emergencyPhone} onChange={(e) => setField('emergencyPhone', e.target.value)} />
            </CmsField>
            <CmsField label="Relation">
              <input className={cmsInputClass} value={form.emergencyRelation} onChange={(e) => setField('emergencyRelation', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Admin notes</h2>
          <div className="mt-4">
            <CmsField label="Internal notes">
              <textarea className={cmsTextareaClass} value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add volunteer'}
          </button>
        </div>
      </form>
    </div>
  )
}
