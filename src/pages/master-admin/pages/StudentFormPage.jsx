import { ArrowLeft, Loader2, Printer, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import {
  createStudent,
  fetchStudentById,
  updateStudent,
  uploadStudentPhoto,
} from '../../../services/students'
import { BLOOD_GROUPS, DISABILITY_TYPES, STUDENT_STATUSES, ageFromDob, printStudentAdmission } from '../../../utils/student'
import { CmsField, CmsToast, ImageSourcePicker, cmsInputClass, cmsTextareaClass } from './cms/CmsUi'
import StudentAdmissionPrint from './students/StudentAdmissionPrint'

const emptyForm = {
  registrationNumber: '',
  registrationDate: new Date().toISOString().slice(0, 10),
  photoUrl: '',
  name: '',
  age: '',
  gender: '',
  dateOfBirth: '',
  disabilityType: '',
  fatherGuardianName: '',
  motherName: '',
  address: '',
  city: 'Narsinghpur',
  state: 'Madhya Pradesh',
  pincode: '',
  guardianPhone: '',
  guardianEmail: '',
  fatherOccupation: '',
  fatherEducation: '',
  fatherAge: '',
  motherOccupation: '',
  motherEducation: '',
  motherAge: '',
  caste: '',
  motherTongue: 'हिन्दी',
  siblingsCount: '',
  familyDisabilityType: '',
  childInterests: '',
  childNature: '',
  familyEnvironment: '',
  aadhaarNumber: '',
  bloodGroup: '',
  className: '',
  declarationName: '',
  declarationRelation: 'आत्मज',
  declarationAgreed: false,
  declarationDate: new Date().toISOString().slice(0, 10),
  guardianSignature: '',
  notes: '',
  status: 'applied',
}

export default function StudentFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [showPrint, setShowPrint] = useState(false)

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const token = getMasterAdminToken()
        const result = await fetchStudentById(id, token)
        if (cancelled) return
        const data = result?.data || {}
        setForm({
          ...emptyForm,
          ...data,
          aadhaarNumber: data.aadhaarNumber || '',
          registrationDate: data.registrationDate || emptyForm.registrationDate,
          declarationDate: data.declarationDate || emptyForm.declarationDate,
          declarationAgreed: Boolean(data.declarationAgreed),
        })
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Unable to load student.')
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
    setForm((current) => {
      const next = { ...current, [key]: value }
      if (key === 'dateOfBirth') next.age = ageFromDob(value) || current.age
      if (key === 'fatherGuardianName' && !current.declarationName) next.declarationName = value
      if (key === 'fatherGuardianName' && !current.guardianSignature) next.guardianSignature = value
      return next
    })
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await uploadStudentPhoto(file, token)
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = isEdit
        ? await updateStudent(id, form, token)
        : await createStudent(form, token)
      setToast(result?.message || 'Student saved.')
      setTimeout(() => navigate('/master-admin/students'), 700)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save student.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading student...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Students</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">
            {isEdit ? 'Edit Admission' : 'प्रवेश हेतु आवेदन-पत्र'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            मूक, बधिर एवं मानसिक मंद विद्यार्थियों के प्रवेश का आवेदन — विकलांग सेवा संस्थान नरसिंहपुर।
          </p>
        </div>
        <Link
          to="/master-admin/students"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">1. पंजीयन / फोटो</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="पंजीयन क्रमांक" hint="खाली छोड़ें तो अपने आप बनेगा">
              <input className={cmsInputClass} value={form.registrationNumber} onChange={(e) => setField('registrationNumber', e.target.value)} />
            </CmsField>
            <CmsField label="दिनांक">
              <input type="date" className={cmsInputClass} value={form.registrationDate} onChange={(e) => setField('registrationDate', e.target.value)} />
            </CmsField>
          </div>
          <div className="mt-4 max-w-md">
            <ImageSourcePicker label="छात्र फोटो" value={form.photoUrl} uploading={uploading} onChange={(v) => setField('photoUrl', v)} onUpload={handleUpload} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">2–5. छात्र विवरण</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="2. नाम">
              <input className={cmsInputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} required />
            </CmsField>
            <CmsField label="विकलांगता का प्रकार">
              <select className={cmsInputClass} value={form.disabilityType} onChange={(e) => setField('disabilityType', e.target.value)}>
                <option value="">चयन करें</option>
                {DISABILITY_TYPES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </CmsField>
            <CmsField label="3. आयु">
              <input className={cmsInputClass} value={form.age} onChange={(e) => setField('age', e.target.value)} />
            </CmsField>
            <CmsField label="लिंग">
              <select className={cmsInputClass} value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">चयन करें</option>
                <option>पुरुष</option>
                <option>स्त्री</option>
                <option>अन्य</option>
              </select>
            </CmsField>
            <CmsField label="जन्म तिथि">
              <input type="date" className={cmsInputClass} value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
            </CmsField>
            <CmsField label="ब्लड ग्रुप">
              <select className={cmsInputClass} value={form.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)}>
                <option value="">चयन करें</option>
                {BLOOD_GROUPS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </CmsField>
            <CmsField label="4. पिता-अभिभावक का नाम">
              <input className={cmsInputClass} value={form.fatherGuardianName} onChange={(e) => setField('fatherGuardianName', e.target.value)} required />
            </CmsField>
            <CmsField label="माता का नाम">
              <input className={cmsInputClass} value={form.motherName} onChange={(e) => setField('motherName', e.target.value)} />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="5. पता">
                <textarea className={cmsTextareaClass} value={form.address} onChange={(e) => setField('address', e.target.value)} />
              </CmsField>
            </div>
            <CmsField label="शहर">
              <input className={cmsInputClass} value={form.city} onChange={(e) => setField('city', e.target.value)} />
            </CmsField>
            <CmsField label="राज्य">
              <input className={cmsInputClass} value={form.state} onChange={(e) => setField('state', e.target.value)} />
            </CmsField>
            <CmsField label="पिनकोड">
              <input className={cmsInputClass} value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} />
            </CmsField>
            <CmsField label="अभिभावक मोबाइल">
              <input className={cmsInputClass} value={form.guardianPhone} onChange={(e) => setField('guardianPhone', e.target.value)} />
            </CmsField>
            <CmsField label="ईमेल">
              <input type="email" className={cmsInputClass} value={form.guardianEmail} onChange={(e) => setField('guardianEmail', e.target.value)} />
            </CmsField>
            <CmsField label="आधार संख्या" hint="12 अंक · सूची में masked रहेगा">
              <input
                className={cmsInputClass}
                inputMode="numeric"
                maxLength={12}
                value={form.aadhaarNumber}
                onChange={(e) => setField('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
            </CmsField>
            <CmsField label="कक्षा / समूह">
              <input className={cmsInputClass} value={form.className} onChange={(e) => setField('className', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">6–7. माता-पिता का विवरण</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <CmsField label="6. पिता का व्यवसाय">
              <input className={cmsInputClass} value={form.fatherOccupation} onChange={(e) => setField('fatherOccupation', e.target.value)} />
            </CmsField>
            <CmsField label="शिक्षा">
              <input className={cmsInputClass} value={form.fatherEducation} onChange={(e) => setField('fatherEducation', e.target.value)} />
            </CmsField>
            <CmsField label="उम्र">
              <input className={cmsInputClass} value={form.fatherAge} onChange={(e) => setField('fatherAge', e.target.value)} />
            </CmsField>
            <CmsField label="7. माता का व्यवसाय">
              <input className={cmsInputClass} value={form.motherOccupation} onChange={(e) => setField('motherOccupation', e.target.value)} />
            </CmsField>
            <CmsField label="शिक्षा">
              <input className={cmsInputClass} value={form.motherEducation} onChange={(e) => setField('motherEducation', e.target.value)} />
            </CmsField>
            <CmsField label="उम्र">
              <input className={cmsInputClass} value={form.motherAge} onChange={(e) => setField('motherAge', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">8–13. परिवार एवं स्वभाव</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="8. जाति">
              <input className={cmsInputClass} value={form.caste} onChange={(e) => setField('caste', e.target.value)} />
            </CmsField>
            <CmsField label="मातृ भाषा">
              <input className={cmsInputClass} value={form.motherTongue} onChange={(e) => setField('motherTongue', e.target.value)} />
            </CmsField>
            <CmsField label="9. अन्य भाई एवं बहिन की संख्या">
              <input className={cmsInputClass} value={form.siblingsCount} onChange={(e) => setField('siblingsCount', e.target.value)} />
            </CmsField>
            <CmsField label="10. परिवार में विकलांग सदस्य हो तो प्रकार">
              <input className={cmsInputClass} value={form.familyDisabilityType} onChange={(e) => setField('familyDisabilityType', e.target.value)} />
            </CmsField>
            <CmsField label="11. बालक-बालिका की रुचि">
              <input className={cmsInputClass} value={form.childInterests} onChange={(e) => setField('childInterests', e.target.value)} />
            </CmsField>
            <CmsField label="12. बालक-बालिका का स्वभाव">
              <input className={cmsInputClass} value={form.childNature} onChange={(e) => setField('childNature', e.target.value)} />
            </CmsField>
            <div className="sm:col-span-2">
              <CmsField label="13. परिवार का वातावरण">
                <textarea className={`${cmsTextareaClass} min-h-[120px]`} value={form.familyEnvironment} onChange={(e) => setField('familyEnvironment', e.target.value)} />
              </CmsField>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">घोषणा-पत्र</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            मैं {form.declarationName || '………………'} {form.declarationRelation || 'आत्मज/आत्मजा'}{' '}
            {form.fatherGuardianName || '………………'} यह घोषणा करता हूँ कि मैं अपने बालक/बालिका के हित में विकलांग सेवा संस्थान
            के सभी नियमों का पालन करूंगा। एवं संस्था के कार्यालयीन समय में किसी तरह की आकस्मिक दुर्घटना, चोट लगने के लिए मैं
            संस्था को दोषी करार नहीं करूंगा।
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField label="घोषणाकर्ता का नाम">
              <input className={cmsInputClass} value={form.declarationName} onChange={(e) => setField('declarationName', e.target.value)} />
            </CmsField>
            <CmsField label="आत्मज / आत्मजा">
              <select className={cmsInputClass} value={form.declarationRelation} onChange={(e) => setField('declarationRelation', e.target.value)}>
                <option>आत्मज</option>
                <option>आत्मजा</option>
              </select>
            </CmsField>
            <CmsField label="दिनांक">
              <input type="date" className={cmsInputClass} value={form.declarationDate} onChange={(e) => setField('declarationDate', e.target.value)} />
            </CmsField>
            <CmsField label="हस्ताक्षर पिता/अभिभावक (नाम)">
              <input className={cmsInputClass} value={form.guardianSignature} onChange={(e) => setField('guardianSignature', e.target.value)} />
            </CmsField>
            <CmsField label="स्थिति">
              <select className={cmsInputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {STUDENT_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.labelHi} / {item.label}
                  </option>
                ))}
              </select>
            </CmsField>
          </div>
          <label className="mt-4 flex items-start gap-2 text-sm text-navy">
            <input
              type="checkbox"
              checked={form.declarationAgreed}
              onChange={(e) => setField('declarationAgreed', e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand"
            />
            <span>अभिभावक ने घोषणा-पत्र पढ़कर सहमति दी है।</span>
          </label>
          <div className="mt-4">
            <CmsField label="आंतरिक नोट्स">
              <textarea className={cmsTextareaClass} value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
            </CmsField>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowPrint(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90"
          >
            <Printer className="h-4 w-4" />
            प्रिंट आवेदन
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'प्रवेश आवेदन सहेजें'}
          </button>
        </div>
      </form>

      {showPrint ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-8">
          <div className="w-full max-w-[220mm]">
            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <div>
                <p className="text-sm font-semibold text-navy">प्रवेश आवेदन-पत्र</p>
                <p className="text-xs text-text-muted">
                  {form.registrationNumber || form.name || 'Filled form'} · print A4 copy
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={printStudentAdmission}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
                >
                  <Printer className="h-4 w-4" />
                  Print form
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrint(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
            <div id="student-admission-print-root" className="overflow-x-auto rounded-sm bg-white p-2 shadow-xl sm:p-3">
              <StudentAdmissionPrint student={form} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
