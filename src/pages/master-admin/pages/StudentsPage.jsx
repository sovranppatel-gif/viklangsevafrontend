import { GraduationCap, Loader2, Pencil, Plus, Printer, Search, Trash2, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import { CmsToast, cmsInputClass } from './cms/CmsUi'
import StudentAdmissionPrint from './students/StudentAdmissionPrint'
import { deleteStudent, fetchStudentById, fetchStudents, updateStudent } from '../../../services/students'
import {
  STUDENT_STATUSES,
  formatStudentDate,
  printStudentAdmission,
  studentInitials,
} from '../../../utils/student'

const STATUS_FILTERS = [{ value: 'all', label: 'All', labelHi: 'सभी' }, ...STUDENT_STATUSES]

function statusBadgeClass(status) {
  if (status === 'applied') return 'bg-amber-50 text-amber-800 ring-amber-200'
  if (status === 'admitted') return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
  if (status === 'left') return 'bg-sky-50 text-sky-800 ring-sky-200'
  if (status === 'archived') return 'bg-slate-100 text-slate-700 ring-slate-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function guardianWhatsAppUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length < 10) return ''
  const withCountry = digits.length === 10 ? `91${digits}` : digits
  return `https://wa.me/${withCountry}`
}

export default function StudentsPage() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [busyId, setBusyId] = useState('')
  const [printStudent, setPrintStudent] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      if (!token) {
        setError('Please sign in again to view students.')
        setItems([])
        return
      }
      const result = await fetchStudents(token, {
        ...(filter !== 'all' ? { status: filter } : {}),
        ...(search ? { q: search } : {}),
      })
      setItems(Array.isArray(result?.data) ? result.data : [])
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.code === 'ECONNABORTED'
          ? 'Server took too long to respond. Please try again.'
          : err?.code === 'ERR_NETWORK'
            ? 'Cannot reach server. Make sure the API is running on port 5000.'
            : 'Unable to load students. Please refresh.')
      setError(message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (id, status) => {
    setBusyId(id)
    try {
      const token = getMasterAdminToken()
      const result = await updateStudent(id, { status }, token)
      const updated = result?.data
      setItems((current) =>
        current
          .map((item) => (item.id === id ? { ...item, ...updated } : item))
          .filter((item) => (filter === 'all' ? true : item.status === filter)),
      )
      setPrintStudent((current) => (current?.id === id ? { ...current, ...updated } : current))
      setToast('Status updated.')
    } catch {
      setError('Unable to update student status.')
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record permanently?')) return
    setBusyId(id)
    try {
      const token = getMasterAdminToken()
      await deleteStudent(id, token)
      setItems((current) => current.filter((item) => item.id !== id))
      setPrintStudent((current) => (current?.id === id ? null : current))
      setToast('Student deleted.')
    } catch {
      setError('Unable to delete student.')
    } finally {
      setBusyId('')
    }
  }

  const openPrintForm = async (item) => {
    setBusyId(item.id)
    try {
      const token = getMasterAdminToken()
      const result = await fetchStudentById(item.id, token)
      setPrintStudent(result?.data || item)
    } catch {
      setPrintStudent(item)
    } finally {
      setBusyId('')
    }
  }

  const openWhatsApp = (item) => {
    const url = guardianWhatsAppUrl(item.guardianPhone)
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="no-print flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Students</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">All Students</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Admission records for deaf, mute and intellectually disabled students at Viklang Sewa Sansthan
            Narsinghpur school.
          </p>
        </div>
        <Link
          to="/master-admin/students/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Link>
      </div>

      <div className="no-print flex flex-wrap gap-2">
        {STATUS_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              filter === option.value
                ? 'bg-navy text-white'
                : 'bg-white text-navy ring-1 ring-border hover:bg-slate-50'
            }`}
          >
            {option.labelHi || option.label}
          </button>
        ))}
      </div>

      <form
        className="no-print flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          setSearch(query.trim())
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            className={`${cmsInputClass} pl-9`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, registration no., phone, class or disability"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy/90"
        >
          Search
        </button>
      </form>

      {error ? (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy ring-1 ring-red-200 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="no-print flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading students…
        </div>
      ) : error ? null : items.length === 0 ? (
        <div className="no-print rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-3 text-sm font-medium text-navy">No students yet</p>
          <p className="mt-1 text-sm text-text-muted">
            Add an admission application from the office form.
          </p>
        </div>
      ) : (
        <div className="no-print overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Registration</th>
                  <th className="px-4 py-3 font-semibold">Guardian</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="align-top transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-bold text-white">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            studentInitials(item.name)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-navy">{item.name}</p>
                          <p className="text-xs text-text-muted">
                            {item.disabilityType || item.className || item.aadhaarMasked || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{item.registrationNumber || '—'}</p>
                      <p className="text-xs text-text-muted">
                        {item.age ? `${item.age} yrs` : '—'}
                        {item.gender ? ` · ${item.gender}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-navy">{item.fatherGuardianName || '—'}</p>
                      <p className="text-xs text-text-muted">{item.guardianPhone || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        disabled={busyId === item.id}
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${statusBadgeClass(item.status)}`}
                      >
                        {STUDENT_STATUSES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.labelHi}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-text-muted">
                      {formatStudentDate(item.registrationDate || item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => openPrintForm(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Form
                        </button>
                        <Link
                          to={`/master-admin/students/${item.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-navy ring-1 ring-border hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={!item.guardianPhone}
                          onClick={() => openWhatsApp(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe57] disabled:opacity-50"
                        >
                          <FaWhatsapp className="h-3.5 w-3.5" />
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {printStudent ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-8">
          <div className="w-full max-w-[220mm]">
            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <div>
                <p className="text-sm font-semibold text-navy">प्रवेश आवेदन-पत्र</p>
                <p className="text-xs text-text-muted">
                  {printStudent.registrationNumber || 'Registration pending'} · print A4 copy
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
                  onClick={() => setPrintStudent(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
            <div id="student-admission-print-root" className="overflow-x-auto rounded-sm bg-white p-2 shadow-xl sm:p-3">
              <StudentAdmissionPrint student={printStudent} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
