import { ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_GALLERY } from '../../../../data/galleryDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchGalleryContent,
  updateGalleryContent,
  uploadGalleryImage,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const GALLERY_CMS_SECTIONS = {
  'home-gallery': {
    title: 'Gallery Section (Home)',
    blurb: 'Home page gallery section heading and preview.',
    livePath: '/',
    type: 'section',
  },
  'gallery-hub': {
    title: 'Gallery Hub Page',
    blurb: 'Main /gallery hero and Photos/Videos cards.',
    livePath: '/gallery',
    type: 'hub',
  },
  'gallery-photos': {
    title: 'Photos Page',
    blurb: 'Hero for /gallery/photos',
    livePath: '/gallery/photos',
    type: 'page',
  },
  'gallery-videos': {
    title: 'Videos Page',
    blurb: 'Hero for /gallery/videos',
    livePath: '/gallery/videos',
    type: 'page',
  },
  'gallery-photo-items': {
    title: 'Manage Photos',
    blurb: 'Add, edit and remove gallery photos.',
    livePath: '/gallery/photos',
    type: 'photos',
  },
  'gallery-video-items': {
    title: 'Manage Videos',
    blurb: 'Add, edit and remove gallery videos.',
    livePath: '/gallery/videos',
    type: 'videos',
  },
}

function emptyPhoto() {
  return {
    id: String(Date.now()),
    title: '',
    titleHi: '',
    category: '',
    categoryHi: '',
    type: 'photo',
    image: '',
    isActive: true,
  }
}

function emptyVideo() {
  return {
    id: `v${Date.now()}`,
    title: '',
    titleHi: '',
    category: '',
    categoryHi: '',
    type: 'video',
    thumbnail: '',
    videoUrl: '',
    isActive: true,
  }
}

function emptyCard() {
  return { title: '', titleHi: '', description: '', descriptionHi: '', to: '' }
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

export default function GalleryCmsPage() {
  const { section } = useParams()
  const meta = GALLERY_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_GALLERY[section] || { items: [] }))
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
        const data = await fetchGalleryContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_GALLERY[section] || { items: [] }), ...rest })
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
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  function updateList(listKey, index, field, value) {
    setError('')
    setForm((prev) => {
      const list = [...(prev[listKey] || [])]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [listKey]: list }
    })
  }

  function addListItem(listKey, factory) {
    setForm((prev) => ({ ...prev, [listKey]: [...(prev[listKey] || []), factory()] }))
  }

  function removeListItem(listKey, index) {
    setForm((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((_, i) => i !== index),
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
      const result = await uploadGalleryImage(file, token)
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
      const result = await updateGalleryContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_GALLERY[section] || { items: [] }), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'Gallery content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'Gallery CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown Gallery CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading gallery content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Gallery Management
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
              <CmsField label="Home preview photo limit" hint="How many photos to show on home">
                <input
                  name="previewLimit"
                  type="number"
                  min="1"
                  max="24"
                  value={form.previewLimit || 6}
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

        {meta.type === 'hub' ? (
          <>
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
            <SectionCard title="Hub cards">
              <div className="space-y-4">
                {(form.cards || []).map((card, index) => (
                  <div key={`card-${index}`} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-navy">Card {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeListItem('cards', index)}
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={cmsInputClass}
                        placeholder="Title EN"
                        value={card.title || ''}
                        onChange={(e) => updateList('cards', index, 'title', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Title HI"
                        value={card.titleHi || ''}
                        onChange={(e) => updateList('cards', index, 'titleHi', e.target.value)}
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Description EN"
                        value={card.description || ''}
                        onChange={(e) => updateList('cards', index, 'description', e.target.value)}
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Description HI"
                        value={card.descriptionHi || ''}
                        onChange={(e) =>
                          updateList('cards', index, 'descriptionHi', e.target.value)
                        }
                      />
                      <input
                        className={`${cmsInputClass} sm:col-span-2`}
                        placeholder="Link e.g. /gallery/photos"
                        value={card.to || ''}
                        onChange={(e) => updateList('cards', index, 'to', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('cards', emptyCard)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Add card
                </button>
              </div>
            </SectionCard>
          </>
        ) : null}

        {meta.type === 'photos' ? (
          <SectionCard title="Photos">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Photo {index + 1}</p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <input
                          type="checkbox"
                          checked={item.isActive !== false}
                          onChange={(e) =>
                            updateList('items', index, 'isActive', e.target.checked)
                          }
                          className="h-3.5 w-3.5 accent-brand"
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() => removeListItem('items', index)}
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
                      onChange={(e) => updateList('items', index, 'title', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Title HI"
                      value={item.titleHi || ''}
                      onChange={(e) => updateList('items', index, 'titleHi', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category EN"
                      value={item.category || ''}
                      onChange={(e) => updateList('items', index, 'category', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category HI"
                      value={item.categoryHi || ''}
                      onChange={(e) => updateList('items', index, 'categoryHi', e.target.value)}
                    />
                  </div>
                  <ImageSourcePicker
                    label="Photo"
                    value={item.image}
                    uploading={uploading}
                    onChange={(v) => updateList('items', index, 'image', v)}
                    onUpload={async (file) => {
                      const url = await handleUpload(file)
                      if (url) updateList('items', index, 'image', url)
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('items', emptyPhoto)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add photo
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'videos' ? (
          <SectionCard title="Videos">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Video {index + 1}</p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <input
                          type="checkbox"
                          checked={item.isActive !== false}
                          onChange={(e) =>
                            updateList('items', index, 'isActive', e.target.checked)
                          }
                          className="h-3.5 w-3.5 accent-brand"
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() => removeListItem('items', index)}
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
                      onChange={(e) => updateList('items', index, 'title', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Title HI"
                      value={item.titleHi || ''}
                      onChange={(e) => updateList('items', index, 'titleHi', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category EN"
                      value={item.category || ''}
                      onChange={(e) => updateList('items', index, 'category', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Category HI"
                      value={item.categoryHi || ''}
                      onChange={(e) => updateList('items', index, 'categoryHi', e.target.value)}
                    />
                    <input
                      className={`${cmsInputClass} sm:col-span-2`}
                      placeholder="Video embed URL (YouTube)"
                      value={item.videoUrl || ''}
                      onChange={(e) => updateList('items', index, 'videoUrl', e.target.value)}
                    />
                  </div>
                  <ImageSourcePicker
                    label="Thumbnail"
                    value={item.thumbnail}
                    uploading={uploading}
                    onChange={(v) => updateList('items', index, 'thumbnail', v)}
                    onUpload={async (file) => {
                      const url = await handleUpload(file)
                      if (url) updateList('items', index, 'thumbnail', url)
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('items', emptyVideo)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add video
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type !== 'photos' && meta.type !== 'videos' ? (
          <div className="flex flex-wrap items-center justify-end gap-3">
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
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
