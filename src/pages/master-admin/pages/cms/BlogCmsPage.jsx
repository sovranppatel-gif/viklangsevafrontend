import { ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_BLOG } from '../../../../data/blogDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchBlogContent,
  updateBlogContent,
  uploadBlogImage,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const BLOG_CMS_SECTIONS = {
  'home-blog': {
    title: 'Blog Section (Home)',
    blurb: 'Home page Latest News & Stories section.',
    livePath: '/',
    type: 'section-blog',
  },
  'home-events': {
    title: 'Events Section (Home)',
    blurb: 'Home page Upcoming Events section.',
    livePath: '/',
    type: 'section-events',
  },
  'news-hub': {
    title: 'News Hub Page',
    blurb: 'Main /news hub hero and cards.',
    livePath: '/news',
    type: 'hub',
  },
  'news-blog': {
    title: 'Blog Page',
    blurb: 'Hero for /news/blog',
    livePath: '/news/blog',
    type: 'page',
  },
  'news-news': {
    title: 'News Page',
    blurb: 'Hero for /news/news',
    livePath: '/news/news',
    type: 'page',
  },
  'news-events': {
    title: 'Events Page',
    blurb: 'Hero for /news/events',
    livePath: '/news/events',
    type: 'page',
  },
  'blog-articles': {
    title: 'Manage Articles',
    blurb: 'Create and edit blog/news articles.',
    livePath: '/news/blog',
    type: 'articles',
  },
  'event-items': {
    title: 'Manage Events',
    blurb: 'Create and edit upcoming events.',
    livePath: '/news/events',
    type: 'events',
  },
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function emptyArticle() {
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
    category: 'NGO News',
    categoryHi: '',
    date: new Date().toISOString().slice(0, 10),
    isActive: true,
  }
}

function emptyEvent() {
  return {
    id: String(Date.now()),
    slug: '',
    title: '',
    titleHi: '',
    date: new Date().toISOString().slice(0, 10),
    time: '',
    location: '',
    locationHi: '',
    description: '',
    descriptionHi: '',
    image: '',
    ctaLabel: 'Join as Volunteer',
    ctaLabelHi: 'स्वयंसेवक बनें',
    ctaLink: '/get-involved/volunteer',
    isActive: true,
  }
}

function emptyCard() {
  return { title: '', titleHi: '', to: '' }
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

export default function BlogCmsPage() {
  const { section } = useParams()
  const meta = BLOG_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_BLOG[section] || { items: [] }))
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
        const data = await fetchBlogContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_BLOG[section] || { items: [] }), ...rest })
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

  function updateList(listKey, index, field, value) {
    setError('')
    setForm((prev) => {
      const list = [...(prev[listKey] || [])]
      list[index] = { ...list[index], [field]: value }
      if (field === 'title' && listKey === 'items' && !list[index].slug) {
        list[index].slug = slugify(value)
      }
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
      const result = await uploadBlogImage(file, token)
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
      const result = await updateBlogContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_BLOG[section] || { items: [] }), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'Blog content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'Blog CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown Blog CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading blog content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Blog Management
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
        {meta.type === 'section-blog' || meta.type === 'section-events' ? (
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
              {meta.type === 'section-blog' ? (
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="readMoreLabel"
                  hiName="readMoreLabelHi"
                  enLabel="Read more label (English)"
                  hiLabel="Read more label (Hindi)"
                />
              ) : (
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="detailsLabel"
                  hiName="detailsLabelHi"
                  enLabel="Details label (English)"
                  hiLabel="Details label (Hindi)"
                />
              )}
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
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="openLabel"
                  hiName="openLabelHi"
                  enLabel="Card CTA (English)"
                  hiLabel="Card CTA (Hindi)"
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
                      <input
                        className={`${cmsInputClass} sm:col-span-2`}
                        placeholder="Link e.g. /news/blog"
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

        {meta.type === 'articles' ? (
          <SectionCard title="Articles">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Article {index + 1}</p>
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
                      placeholder="Slug"
                      value={item.slug || ''}
                      onChange={(e) => updateList('items', index, 'slug', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      type="date"
                      value={item.date || ''}
                      onChange={(e) => updateList('items', index, 'date', e.target.value)}
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
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Excerpt EN"
                      value={item.excerpt || ''}
                      onChange={(e) => updateList('items', index, 'excerpt', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Excerpt HI"
                      value={item.excerptHi || ''}
                      onChange={(e) => updateList('items', index, 'excerptHi', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Content EN"
                      value={item.content || ''}
                      onChange={(e) => updateList('items', index, 'content', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Content HI"
                      value={item.contentHi || ''}
                      onChange={(e) => updateList('items', index, 'contentHi', e.target.value)}
                    />
                  </div>
                  <ImageSourcePicker
                    label="Article image"
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
                onClick={() => addListItem('items', emptyArticle)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add article
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'events' ? (
          <SectionCard title="Events">
            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">Event {index + 1}</p>
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
                      placeholder="Slug"
                      value={item.slug || ''}
                      onChange={(e) => updateList('items', index, 'slug', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      type="date"
                      value={item.date || ''}
                      onChange={(e) => updateList('items', index, 'date', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Time"
                      value={item.time || ''}
                      onChange={(e) => updateList('items', index, 'time', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Location EN"
                      value={item.location || ''}
                      onChange={(e) => updateList('items', index, 'location', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="Location HI"
                      value={item.locationHi || ''}
                      onChange={(e) => updateList('items', index, 'locationHi', e.target.value)}
                    />
                    <textarea
                      className={`${cmsTextareaClass} sm:col-span-2`}
                      placeholder="Description EN"
                      value={item.description || ''}
                      onChange={(e) => updateList('items', index, 'description', e.target.value)}
                    />
                    <textarea
                      className={`${cmsTextareaClass} sm:col-span-2`}
                      placeholder="Description HI"
                      value={item.descriptionHi || ''}
                      onChange={(e) => updateList('items', index, 'descriptionHi', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="CTA label EN"
                      value={item.ctaLabel || ''}
                      onChange={(e) => updateList('items', index, 'ctaLabel', e.target.value)}
                    />
                    <input
                      className={cmsInputClass}
                      placeholder="CTA label HI"
                      value={item.ctaLabelHi || ''}
                      onChange={(e) => updateList('items', index, 'ctaLabelHi', e.target.value)}
                    />
                    <input
                      className={`${cmsInputClass} sm:col-span-2`}
                      placeholder="CTA link"
                      value={item.ctaLink || ''}
                      onChange={(e) => updateList('items', index, 'ctaLink', e.target.value)}
                    />
                  </div>
                  <ImageSourcePicker
                    label="Event image"
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
                onClick={() => addListItem('items', emptyEvent)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Add event
              </button>
            </div>
          </SectionCard>
        ) : null}

        {meta.type !== 'articles' && meta.type !== 'events' ? (
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
