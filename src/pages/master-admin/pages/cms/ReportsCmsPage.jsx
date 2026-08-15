import { ExternalLink, FileUp, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_REPORTS } from '../../../../data/reportsDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchReportsContent,
  updateReportsContent,
  uploadReportsDocument,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const REPORTS_CMS_SECTIONS = {
  'home-reports': {
    title: 'Reports Section (Home)',
    blurb: 'Home page Transparency & Reports section.',
    livePath: '/',
    type: 'section',
  },
  'reports-hub': {
    title: 'Reports Page',
    blurb: 'Hero for /reports',
    livePath: '/reports',
    type: 'page',
  },
  'report-items': {
    title: 'Manage Documents',
    blurb: 'Add, edit and upload report PDFs and certificates.',
    livePath: '/reports',
    type: 'items',
  },
}

function emptyDoc() {
  return {
    id: String(Date.now()),
    title: '',
    titleHi: '',
    description: '',
    descriptionHi: '',
    fileUrl: '',
    placeholder: true,
    isActive: true,
  }
}

function BilingualPair({ enName, hiName, enLabel, hiLabel, form, onChange, textarea = false }) {
  const Comp = textarea ? 'textarea' : 'input'
  const className = textarea ? cmsTextareaClass : cmsInputClass
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CmsField label={enLabel}>
        <Comp name={enName} value={form[enName] || ''} onChange={onChange} className={className} />
      </CmsField>
      <CmsField label={hiLabel}>
        <Comp name={hiName} value={form[hiName] || ''} onChange={onChange} className={className} />
      </CmsField>
    </div>
  )
}

export default function ReportsCmsPage() {
  const { section } = useParams()
  const meta = REPORTS_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_REPORTS[section] || { items: [] }))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const fileRefs = useRef({})

  const clearSuccess = useCallback(() => setSuccess(''), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!meta) return
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const data = await fetchReportsContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_REPORTS[section] || { items: [] }), ...rest })
        setUpdatedAt(at || null)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load content.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [section, meta])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setError('')
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function updateList(index, field, value) {
    setError('')
    setForm((prev) => {
      const list = [...(prev.items || [])]
      list[index] = { ...list[index], [field]: value }
      if (field === 'fileUrl') {
        list[index].placeholder = !String(value || '').trim() || value === '#'
      }
      return { ...prev, items: list }
    })
  }

  async function handleFileUpload(index, file) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be 10MB or smaller.')
      return
    }
    setUploadingIndex(index)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await uploadReportsDocument(file, token)
      if (!result?.success || !result?.data?.fileUrl) {
        setError(result?.message || 'Upload failed.')
        return
      }
      updateList(index, 'fileUrl', result.data.fileUrl)
      setSuccess(result.message || 'Document uploaded successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload document.')
    } finally {
      setUploadingIndex(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const payload = { ...form }
      delete payload.updatedAt
      delete payload.key
      const result = await updateReportsContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_REPORTS[section] || { items: [] }), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'Reports content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'Reports CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown Reports CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading reports content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Reports & Documents
          </p>
          <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-text-muted">{meta.blurb}</p>
          {updatedAt ? (
            <p className="mt-1 text-xs text-text-muted">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <Link
          to={meta.livePath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
        >
          View live page
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        {meta.type === 'section' ? (
          <SectionCard title="Section content">
            <div className="space-y-4">
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="sectionLabel"
                hiName="sectionLabelHi"
                enLabel="Label (English)"
                hiLabel="Label (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="title"
                hiName="titleHi"
                enLabel="Title (English)"
                hiLabel="Title (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="description"
                hiName="descriptionHi"
                enLabel="Description (English)"
                hiLabel="Description (Hindi)"
                textarea
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="viewAllLabel"
                hiName="viewAllLabelHi"
                enLabel="View all label (English)"
                hiLabel="View all label (Hindi)"
              />
              <CmsField label="View all link">
                <input
                  name="viewAllLink"
                  value={form.viewAllLink || ''}
                  onChange={handleChange}
                  className={cmsInputClass}
                />
              </CmsField>
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="viewPdfLabel"
                hiName="viewPdfLabelHi"
                enLabel="View PDF label (English)"
                hiLabel="View PDF label (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="downloadLabel"
                hiName="downloadLabelHi"
                enLabel="Download label (English)"
                hiLabel="Download label (Hindi)"
              />
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'page' ? (
          <SectionCard title="Page hero">
            <div className="space-y-4">
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroLabel"
                hiName="heroLabelHi"
                enLabel="Label (English)"
                hiLabel="Label (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroTitle"
                hiName="heroTitleHi"
                enLabel="Title (English)"
                hiLabel="Title (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroDescription"
                hiName="heroDescriptionHi"
                enLabel="Description (English)"
                hiLabel="Description (Hindi)"
                textarea
              />
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'items' ? (
          <SectionCard title="Documents">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Document {index + 1}</p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <input
                          type="checkbox"
                          checked={item.isActive !== false}
                          onChange={(e) => updateList(index, 'isActive', e.target.checked)}
                          className="h-3.5 w-3.5 accent-brand"
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            items: (prev.items || []).filter((_, i) => i !== index),
                          }))
                        }
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={cmsInputClass}
                      placeholder="Title EN"
                      value={item.title || ''}
                      onChange={(e) => updateList(index, 'title', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Title HI"
                      value={item.titleHi || ''}
                      onChange={(e) => updateList(index, 'titleHi', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Description EN"
                      value={item.description || ''}
                      onChange={(e) => updateList(index, 'description', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Description HI"
                      value={item.descriptionHi || ''}
                      onChange={(e) => updateList(index, 'descriptionHi', e.target.value)}
                    />
                    <input
                      className={`${cmsInputClass} sm:col-span-2`}
                      placeholder="File URL (or upload below)"
                      value={item.fileUrl || ''}
                      onChange={(e) => updateList(index, 'fileUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      ref={(el) => {
                        fileRefs.current[index] = el
                      }}
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        handleFileUpload(index, file)
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingIndex === index}
                      onClick={() => fileRefs.current[index]?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-navy hover:border-brand/40 hover:bg-brand-soft/40 disabled:opacity-60"
                    >
                      {uploadingIndex === index ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      ) : (
                        <FileUp className="h-4 w-4" />
                      )}
                      {uploadingIndex === index ? 'Uploading...' : 'Upload PDF / document'}
                    </button>
                    <p className="mt-1 text-xs text-text-muted">PDF, DOC, DOCX or image · max 10MB</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, items: [...(prev.items || []), emptyDoc()] }))
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add document
              </button>
            </div>
          </SectionCard>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          {meta.type !== 'items' ? (
            <label className="mr-auto flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                name="isActive"
                checked={Boolean(form.isActive)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border accent-brand"
              />
              <span className="font-semibold">Show this on the website</span>
            </label>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
