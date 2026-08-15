import { Loader2, Mail, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMasterAdminToken } from '../data/auth'
import { CmsToast } from './cms/CmsUi'
import { deleteEnquiry, fetchEnquiries, updateEnquiryStatus } from '../../../services/enquiries'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
]

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return String(value)
  }
}

function statusBadgeClass(status) {
  if (status === 'new') return 'bg-amber-50 text-amber-800 ring-amber-200'
  if (status === 'read') return 'bg-sky-50 text-sky-800 ring-sky-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export default function EnquiriesPage() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [busyId, setBusyId] = useState('')
  const [selectedId, setSelectedId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await fetchEnquiries(token, filter === 'all' ? undefined : filter)
      setItems(Array.isArray(result?.data) ? result.data : [])
    } catch {
      setError('Unable to load enquiries. Please refresh.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!items.length) {
      setSelectedId('')
      return
    }
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId],
  )

  const handleStatusChange = async (id, status) => {
    setBusyId(id)
    try {
      const token = getMasterAdminToken()
      const result = await updateEnquiryStatus(id, status, token)
      const updated = result?.data
      setItems((current) =>
        current
          .map((item) => (item.id === id ? { ...item, ...updated } : item))
          .filter((item) => (filter === 'all' ? true : item.status === filter)),
      )
      setToast('Enquiry status updated.')
    } catch {
      setError('Unable to update enquiry status.')
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return
    setBusyId(id)
    try {
      const token = getMasterAdminToken()
      await deleteEnquiry(id, token)
      setItems((current) => current.filter((item) => item.id !== id))
      setToast('Enquiry deleted.')
    } catch {
      setError('Unable to delete enquiry.')
    } finally {
      setBusyId('')
    }
  }

  const handleOpen = async (item) => {
    setSelectedId(item.id)
    if (item.status === 'new') {
      await handleStatusChange(item.id, 'read')
    }
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div>
        <p className="text-sm font-medium text-brand">Enquiries</p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Contact Messages</h1>
        <p className="mt-1 text-sm text-text-muted">
          Messages submitted from the website contact form appear here.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
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
            {option.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading enquiries…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <Mail className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-3 text-sm font-medium text-navy">No enquiries yet</p>
          <p className="mt-1 text-sm text-text-muted">
            When someone sends a message from Contact, it will show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const active = item.id === selectedId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className={`flex w-full flex-col gap-1 px-4 py-3.5 text-left transition ${
                        active ? 'bg-brand/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-navy">{item.name}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${statusBadgeClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="truncate text-sm text-text-muted">{item.email}</p>
                      <p className="text-xs text-text-muted">{formatDate(item.createdAt)}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {selected ? (
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-navy">{selected.name}</h2>
                  <p className="mt-1 text-sm text-text-muted">{formatDate(selected.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${statusBadgeClass(selected.status)}`}
                >
                  {selected.status}
                </span>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-text-muted">Email</dt>
                  <dd>
                    <a className="text-navy hover:text-brand" href={`mailto:${selected.email}`}>
                      {selected.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-text-muted">Mobile</dt>
                  <dd>
                    <a className="text-navy hover:text-brand" href={`tel:${selected.mobile}`}>
                      {selected.mobile}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-text-muted">Message</dt>
                  <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-navy">
                    {selected.message}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {['new', 'read', 'archived'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={busyId === selected.id || selected.status === status}
                    onClick={() => handleStatusChange(selected.id, status)}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium capitalize text-navy ring-1 ring-border transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark {status}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={busyId === selected.id}
                  onClick={() => handleDelete(selected.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
