import { FileText, Loader2, Plus, Printer, Search, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMasterAdminToken } from '../data/auth'
import { fetchDonations, updateDonation } from '../../../services/donations'
import { formatCurrencyINR } from '../../../utils/format'
import { buildReceiptSerial, printDonationReceipt } from '../../../utils/receipt'
import { buildDonorWhatsAppUrl } from '../../../utils/whatsappDonor'
import { CmsToast, cmsInputClass } from './cms/CmsUi'
import DonationReceipt80G from './donations/DonationReceipt80G'

const SOURCE_FILTERS = [
  { value: 'all', label: 'All sources' },
  { value: 'website', label: 'Website' },
  { value: 'office', label: 'Office' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All status' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'receipt_sent', label: 'Receipt sent' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDateTime(value) {
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

function badgeClass(kind, value) {
  if (kind === 'source') {
    return value === 'website'
      ? 'bg-sky-50 text-sky-800 ring-sky-200'
      : 'bg-violet-50 text-violet-800 ring-violet-200'
  }
  if (value === 'new') return 'bg-amber-50 text-amber-800 ring-amber-200'
  if (value === 'confirmed') return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
  if (value === 'receipt_sent') return 'bg-blue-50 text-blue-800 ring-blue-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export default function AllDonorsPage() {
  const [items, setItems] = useState([])
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [receiptDonor, setReceiptDonor] = useState(null)
  const [receiptSerial, setReceiptSerial] = useState('')
  const [preparingReceipt, setPreparingReceipt] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await fetchDonations(token, {
        ...(source !== 'all' ? { source } : {}),
        ...(status !== 'all' ? { status } : {}),
        ...(search ? { q: search } : {}),
      })
      setItems(Array.isArray(result?.data) ? result.data : [])
    } catch {
      setError('Unable to load donors. Please refresh.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [source, status, search])

  useEffect(() => {
    load()
  }, [load])

  const totals = useMemo(() => {
    const confirmed = items.filter((item) => item.status !== 'cancelled')
    return {
      count: items.length,
      amount: confirmed.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    }
  }, [items])

  const openReceipt = async (donation, event) => {
    event?.stopPropagation?.()
    setPreparingReceipt(true)
    setError('')
    try {
      const serial = buildReceiptSerial(donation)
      let next = { ...donation, receiptNumber: donation.receiptNumber || serial }

      if (!donation.receiptNumber || donation.status === 'new' || donation.status === 'confirmed') {
        const token = getMasterAdminToken()
        const payload = {
          receiptNumber: next.receiptNumber,
          ...(donation.status !== 'receipt_sent' && donation.status !== 'cancelled'
            ? { status: 'receipt_sent' }
            : {}),
        }
        const result = await updateDonation(donation.id, payload, token)
        next = { ...next, ...(result?.data || {}) }
        setItems((current) =>
          current.map((item) => (item.id === donation.id ? { ...item, ...next } : item)),
        )
        setToast('80G receipt ready. You can print a copy now.')
      }

      setReceiptSerial(next.receiptNumber || serial)
      setReceiptDonor(next)
    } catch {
      setError('Unable to prepare 80G receipt.')
    } finally {
      setPreparingReceipt(false)
    }
  }

  const handlePrintReceipt = () => {
    printDonationReceipt()
  }

  const openWhatsApp = (donation, event) => {
    event?.stopPropagation?.()
    const url = buildDonorWhatsAppUrl(donation)
    if (!url) {
      setError('WhatsApp number missing for this donor. Please add phone first.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <CmsToast message={toast} onClose={() => setToast('')} />

      <div className="no-print flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Donations Management</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">All Donors</h1>
          <p className="mt-1 text-sm text-text-muted">
            Website donations and office entries. Generate & print 80G receipts from the table.
          </p>
        </div>
        <Link
          to="/master-admin/donations/create"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" />
          Create Donor
        </Link>
      </div>

      <div className="no-print grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-text-muted">Shown donors</p>
          <p className="mt-1 text-2xl font-bold text-navy">{totals.count}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-text-muted">Total amount (excl. cancelled)</p>
          <p className="mt-1 text-2xl font-bold text-navy">{formatCurrencyINR(totals.amount)}</p>
        </div>
      </div>

      <div className="no-print flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSource(option.value)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                source === option.value
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy ring-1 ring-border hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                status === option.value
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy ring-1 ring-border hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
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
            placeholder="Search by name, email, phone or receipt no."
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
        <p className="no-print rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="no-print flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading donors…
        </div>
      ) : items.length === 0 ? (
        <div className="no-print rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-navy">No donors found</p>
          <p className="mt-1 text-sm text-text-muted">
            Website donate form submissions and office entries will show here.
          </p>
        </div>
      ) : (
        <div className="no-print overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">80G</th>
                  <th className="px-4 py-3 font-semibold">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.email || item.phone || '—'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">
                      {formatCurrencyINR(item.amount)}
                      <p className="text-xs font-normal text-text-muted capitalize">
                        {item.method} · {item.frequency}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${badgeClass('source', item.source)}`}
                      >
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${badgeClass('status', item.status)}`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                      {formatDateTime(item.donationDate || item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={preparingReceipt || item.status === 'cancelled'}
                        onClick={(event) => openReceipt(item, event)}
                        className="inline-flex items-center gap-1 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Generate 80G receipt"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Receipt
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={!item.phone}
                        onClick={(event) => openWhatsApp(item, event)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-50"
                        title={item.phone ? 'Send receipt details on WhatsApp' : 'Phone number missing'}
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {receiptDonor ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-8">
          <div className="w-full max-w-[220mm]">
            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <div>
                <p className="text-sm font-semibold text-navy">80G Tax Benefit Receipt</p>
                <p className="text-xs text-text-muted">Half A4 receipt — print on A4 and cut along the line</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  disabled={!receiptDonor.phone}
                  onClick={(event) => openWhatsApp(receiptDonor, event)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptDonor(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-border transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            <div id="donation-receipt-print-root" className="overflow-x-auto rounded-sm bg-white p-2 shadow-xl sm:p-3">
              <DonationReceipt80G donation={receiptDonor} serial={receiptSerial} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
