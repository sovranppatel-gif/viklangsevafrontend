import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import IdentityDocUpload from '../../components/volunteer/IdentityDocUpload'
import { submitVolunteerForm } from '../../services/api'
import { lookupVolunteerIdCard, uploadVolunteerDocumentPublic, uploadVolunteerPhotoPublic } from '../../services/volunteers'
import {
  AVAILABILITY_OPTIONS,
  BLOOD_GROUPS,
  VOLUNTEER_DEPARTMENTS,
  emptyVolunteerApplication,
} from '../../utils/volunteer'
import {
  CmsField,
  ImageSourcePicker,
  cmsInputClass,
  cmsTextareaClass,
} from '../master-admin/pages/cms/CmsUi'
import VolunteerIdCard from '../master-admin/pages/volunteers/VolunteerIdCard'

function FormSection({ title, description, children }) {
  return (
    <section className="rounded-[16px] border border-border bg-white p-4 shadow-[0_8px_24px_rgba(11,29,54,0.05)]">
      <div className="mb-3">
        <h3 className="text-base font-bold tracking-tight text-navy">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default function Volunteer() {
  const [form, setForm] = useState(emptyVolunteerApplication)
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [docUploading, setDocUploading] = useState('')
  const [aadhaarLookup, setAadhaarLookup] = useState('')
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')
  const [idCard, setIdCard] = useState(null)

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setStatus('')
    try {
      const result = await uploadVolunteerPhotoPublic(file)
      if (!result?.success || !result?.data?.imageUrl) {
        setSuccess(false)
        setStatus(result?.message || 'Photo upload failed.')
        return
      }
      setField('photoUrl', result.data.imageUrl)
    } catch (error) {
      setSuccess(false)
      setStatus(error?.response?.data?.message || 'Unable to upload photo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDocumentUpload = async (field, file) => {
    setDocUploading(field)
    setStatus('')
    try {
      const result = await uploadVolunteerDocumentPublic(file)
      if (!result?.success || !result?.data?.fileUrl) {
        setSuccess(false)
        setStatus(result?.message || 'Document upload failed.')
        return
      }
      setField(field, result.data.fileUrl)
    } catch (error) {
      setSuccess(false)
      setStatus(error?.response?.data?.message || 'Unable to upload document.')
    } finally {
      setDocUploading('')
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    setSuccess(false)
    try {
      const result = await submitVolunteerForm({
        ...form,
        whatsapp: form.whatsapp || form.phone,
      })
      setStatus(result.message)
      setSuccess(true)
      setForm(emptyVolunteerApplication())
    } catch (error) {
      setSuccess(false)
      setStatus(
        error?.response?.data?.message ||
          'Unable to submit right now. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  const onDownloadIdCard = async (event) => {
    event.preventDefault()
    setCardLoading(true)
    setCardError('')
    setIdCard(null)
    try {
      const result = await lookupVolunteerIdCard(aadhaarLookup)
      if (!result?.success || !result?.data) {
        setCardError(result?.message || 'ID card not found.')
        return
      }
      setIdCard(result.data)
    } catch (error) {
      setCardError(error?.response?.data?.message || 'Unable to fetch ID card right now.')
    } finally {
      setCardLoading(false)
    }
  }

  return (
    <>
      <PageHero
        label="Volunteer"
        title="Become a Volunteer"
        description="Fill the same details used for volunteer records. After admin approval, an ID card can be issued."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Volunteer' },
        ]}
      />
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container-page">
          <div className="mb-5 max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">Volunteer application</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
              Submit this form to send a request to Viklang Sewa Sansthan. The admin team will review it.
              ID cards can be downloaded here with your Aadhaar number after admin approval.
            </p>
          </div>

          <section className="mb-5 rounded-[16px] border border-navy/10 bg-navy p-4 text-white shadow-[0_8px_24px_rgba(11,29,54,0.12)]">
            <h3 className="text-base font-bold">Download your ID card</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/75">
              Enter the same 12-digit Aadhaar number you used while registering. The card is available
              only after the admin approves your request.
            </p>
            <form onSubmit={onDownloadIdCard} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="id-card-aadhaar" className="mb-1 block text-[13px] font-semibold text-white/90">
                  Aadhaar number
                </label>
                <input
                  id="id-card-aadhaar"
                  inputMode="numeric"
                  maxLength={12}
                  value={aadhaarLookup}
                  onChange={(e) => setAadhaarLookup(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="h-11 w-full rounded-[10px] border border-white/20 bg-white px-3 text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="12-digit Aadhaar"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                disabled={cardLoading}
              >
                {cardLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {cardLoading ? 'Checking…' : 'Get ID card'}
              </button>
            </form>
            {cardError ? <p className="mt-2 text-xs text-amber-200">{cardError}</p> : null}
          </section>

          {idCard ? (
            <div className="mb-5 overflow-hidden rounded-[16px] border border-border bg-white p-4 shadow-[0_8px_24px_rgba(11,29,54,0.05)]">
              <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{idCard.volunteerCode}</p>
                  <p className="text-xs text-text-muted">Print or save as PDF from your browser print dialog.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-4 text-sm font-semibold text-white transition hover:bg-navy/90"
                >
                  <Download className="h-4 w-4" />
                  Download / Print
                </button>
              </div>
              <div id="volunteer-idcard-print-root" className="print-root">
                <VolunteerIdCard volunteer={idCard} />
              </div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <FormSection title="Photo" description="A clear passport-style photo helps your volunteer ID card.">
              <div className="max-w-sm">
                <ImageSourcePicker
                  label="Your photo"
                  value={form.photoUrl}
                  uploading={uploading}
                  allowUrl={false}
                  previewClassName="h-28 w-full object-cover"
                  onChange={(value) => setField('photoUrl', value)}
                  onUpload={handleUpload}
                />
              </div>
            </FormSection>

            <FormSection title="Personal details">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
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
            </FormSection>

            <FormSection title="Identity" description="Aadhaar is required to download your ID card after approval.">
              <div className="grid items-start gap-x-4 gap-y-1 sm:grid-cols-2">
                <CmsField label="Aadhaar number" hint="12 digits required · used later to download your ID card">
                  <input
                    className={cmsInputClass}
                    inputMode="numeric"
                    maxLength={12}
                    required
                    value={form.aadhaarNumber}
                    onChange={(e) => setField('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  />
                </CmsField>
                <CmsField label="PAN (optional)" hint="Optional">
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
                  onError={(message) => {
                    setSuccess(false)
                    setStatus(message)
                  }}
                />
                <IdentityDocUpload
                  label="PAN card upload"
                  hint="Optional"
                  value={form.panDocumentUrl}
                  uploading={docUploading === 'panDocumentUrl'}
                  onUpload={(file) => handleDocumentUpload('panDocumentUrl', file)}
                  onError={(message) => {
                    setSuccess(false)
                    setStatus(message)
                  }}
                />
              </div>
            </FormSection>

            <FormSection title="Contact">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
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
            </FormSection>

            <FormSection title="Address">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
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
            </FormSection>

            <FormSection title="Volunteer assignment">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
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
              </div>
            </FormSection>

            <FormSection title="Emergency contact">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-3">
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
            </FormSection>

            <FormSection title="Message">
              <CmsField label="Anything else we should know">
                <textarea className={cmsTextareaClass} value={form.message} onChange={(e) => setField('message', e.target.value)} />
              </CmsField>
            </FormSection>

            <div className="flex flex-col gap-3 rounded-[16px] border border-border bg-white p-4 shadow-[0_8px_24px_rgba(11,29,54,0.05)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-text-muted sm:text-sm">
                Required: name, mobile, email and Aadhaar. Admin will approve before ID card download.
              </p>
              <button type="submit" className="btn-primary h-11 sm:w-auto" disabled={loading || uploading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  'Submit application'
                )}
              </button>
            </div>
            {status ? (
              <p className={`text-sm ${success ? 'text-accent-green' : 'text-red-600'}`} role="status">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  )
}
