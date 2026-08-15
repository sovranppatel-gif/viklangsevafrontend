import { ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_IMPACT, STAT_ICON_OPTIONS } from '../../../../data/impactDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchImpactContent,
  updateImpactContent,
  uploadImpactImage,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const IMPACT_CMS_SECTIONS = {
  'home-stories': {
    title: 'Stories Section (Home)',
    blurb: 'Home page Impact Stories heading and intro.',
    livePath: '/',
    type: 'section',
  },
  'stories-hub': {
    title: 'Stories Page',
    blurb: 'Hero for /impact/stories',
    livePath: '/impact/stories',
    type: 'page',
  },
  'story-items': {
    title: 'Manage Stories',
    blurb: 'Create and edit success stories shown on the website.',
    livePath: '/impact/stories',
    type: 'stories',
  },
  'impact-stats': {
    title: 'Impact Statistics',
    blurb: 'Numbers shown on the home page and Impact Statistics page.',
    livePath: '/impact/statistics',
    type: 'stats',
  },
  'impact-campaign': {
    title: 'Campaign Progress',
    blurb: 'Fundraising goal, raised amount and campaign copy on the home page.',
    livePath: '/',
    type: 'campaign',
  },
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function emptyStory() {
  return {
    id: String(Date.now()),
    slug: '',
    title: '',
    titleHi: '',
    excerpt: '',
    excerptHi: '',
    content: '',
    contentHi: '',
    image: '',
    category: 'Impact',
    categoryHi: '',
    date: new Date().toISOString().slice(0, 10),
    isActive: true,
  }
}

function emptyStat() {
  return {
    id: String(Date.now()),
    value: 0,
    suffix: '+',
    label: '',
    labelHi: '',
    icon: 'HeartHandshake',
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

export default function ImpactCmsPage() {
  const { section } = useParams()
  const meta = IMPACT_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_IMPACT[section] || { items: [] }))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const clearSuccess = useCallback(() => setSuccess(''), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!meta) return
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const data = await fetchImpactContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_IMPACT[section] || { items: [] }), ...rest })
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
      if (field === 'title' && !list[index].slug) {
        list[index].slug = slugify(value)
      }
      return { ...prev, items: list }
    })
  }

  function addListItem(factory) {
    setForm((prev) => ({ ...prev, items: [...(prev.items || []), factory()] }))
  }

  function removeListItem(index) {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }))
  }

  async function handleUpload(file) {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return null
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.')
      return null
    }
    setUploading(true)
    setError('')
    try {
      const token = getMasterAdminToken()
      const result = await uploadImpactImage(file, token)
      if (!result?.success || !result?.data?.imageUrl) {
        setError(result?.message || 'Upload failed.')
        return null
      }
      setSuccess(result.message || 'Image uploaded successfully.')
      return result.data.imageUrl
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload image.')
      return null
    } finally {
      setUploading(false)
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
      const result = await updateImpactContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_IMPACT[section] || { items: [] }), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'Impact content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'Impact CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown Impact CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading impact content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">Impact</p>
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

        {meta.type === 'stories' ? (
          <SectionCard title="Stories">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Story {index + 1}</p>
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
                        onClick={() => removeListItem(index)}
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
                    <input
                      className={cmsInputClass}
                      placeholder="Slug"
                      value={item.slug || ''}
                      onChange={(e) => updateList(index, 'slug', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      type="date"
                      value={item.date || ''}
                      onChange={(e) => updateList(index, 'date', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category EN"
                      value={item.category || ''}
                      onChange={(e) => updateList(index, 'category', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category HI"
                      value={item.categoryHi || ''}
                      onChange={(e) => updateList(index, 'categoryHi', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Excerpt EN"
                      value={item.excerpt || ''}
                      onChange={(e) => updateList(index, 'excerpt', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Excerpt HI"
                      value={item.excerptHi || ''}
                      onChange={(e) => updateList(index, 'excerptHi', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Content EN"
                      value={item.content || ''}
                      onChange={(e) => updateList(index, 'content', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Content HI"
                      value={item.contentHi || ''}
                      onChange={(e) => updateList(index, 'contentHi', e.target.value)}
                    />
                  </div>
                  <ImageSourcePicker
                    label="Story image"
                    value={item.image}
                    uploading={uploading}
                    onChange={(v) => updateList(index, 'image', v)}
                    onUpload={async (file) => {
                      const url = await handleUpload(file)
                      if (url) updateList(index, 'image', url)
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(emptyStory)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add story
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'stats' ? (
          <SectionCard title="Statistics">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Stat {index + 1}</p>
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
                        onClick={() => removeListItem(index)}
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                      className={cmsInputClass}
                      type="number"
                      min="0"
                      placeholder="Value"
                      value={item.value ?? ''}
                      onChange={(e) => updateList(index, 'value', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Suffix e.g. +"
                      value={item.suffix || ''}
                      onChange={(e) => updateList(index, 'suffix', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Label EN"
                      value={item.label || ''}
                      onChange={(e) => updateList(index, 'label', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Label HI"
                      value={item.labelHi || ''}
                      onChange={(e) => updateList(index, 'labelHi', e.target.value)}
                    />
                    <select
                      className={`${cmsInputClass} sm:col-span-2 lg:col-span-4`}
                      value={item.icon || 'HeartHandshake'}
                      onChange={(e) => updateList(index, 'icon', e.target.value)}
                    >
                      {STAT_ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(emptyStat)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add statistic
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'campaign' ? (
          <SectionCard title="Campaign">
            <div className="space-y-4">
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
                enName="quote"
                hiName="quoteHi"
                enLabel="Side quote (English)"
                hiLabel="Side quote (Hindi)"
                textarea
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <CmsField label="Goal (₹)" hint="Total fundraising target">
                  <input
                    name="goal"
                    type="number"
                    min="0"
                    value={form.goal ?? ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
                <CmsField label="Raised (₹)" hint="Amount collected so far">
                  <input
                    name="raised"
                    type="number"
                    min="0"
                    value={form.raised ?? ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
                <CmsField label="Donors today">
                  <input
                    name="donorsToday"
                    type="number"
                    min="0"
                    value={form.donorsToday ?? ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
                <CmsField label="Total supporters">
                  <input
                    name="totalDonors"
                    type="number"
                    min="0"
                    value={form.totalDonors ?? ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
              </div>
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="deadlineLabel"
                hiName="deadlineLabelHi"
                enLabel="Status label (English)"
                hiLabel="Status label (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="ctaLabel"
                hiName="ctaLabelHi"
                enLabel="Button label (English)"
                hiLabel="Button label (Hindi)"
              />
              <CmsField label="Button link">
                <input
                  name="ctaLink"
                  value={form.ctaLink || ''}
                  onChange={handleChange}
                  className={cmsInputClass}
                />
              </CmsField>
              <ImageSourcePicker
                label="Campaign image"
                value={form.image}
                uploading={uploading}
                onChange={(v) => setForm((prev) => ({ ...prev, image: v }))}
                onUpload={async (file) => {
                  const url = await handleUpload(file)
                  if (url) setForm((prev) => ({ ...prev, image: url }))
                }}
              />
            </div>
          </SectionCard>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          {meta.type !== 'stories' && meta.type !== 'stats' ? (
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
