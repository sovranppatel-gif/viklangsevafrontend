import { ExternalLink, Loader2, Save } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_PROGRAMS } from '../../../../data/programsDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchProgramsContent,
  updateProgramsContent,
  uploadProgramsImage,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const PROGRAMS_CMS_SECTIONS = {
  'home-programs': {
    title: 'Programs Section (Home)',
    blurb: 'Home page and /programs grid section heading.',
    livePath: '/',
    type: 'section',
  },
  'programs-hub': {
    title: 'Programs Page',
    blurb: 'Main /programs page hero content.',
    livePath: '/programs',
    type: 'hub',
  },
  'program-education': {
    title: 'Education',
    blurb: 'Content for /programs/education',
    livePath: '/programs/education',
    type: 'program',
  },
  'program-rehabilitation': {
    title: 'Rehabilitation',
    blurb: 'Content for /programs/rehabilitation',
    livePath: '/programs/rehabilitation',
    type: 'program',
  },
  'program-skill-development': {
    title: 'Skill Development',
    blurb: 'Content for /programs/skill-development',
    livePath: '/programs/skill-development',
    type: 'program',
  },
  'program-healthcare': {
    title: 'Healthcare',
    blurb: 'Content for /programs/healthcare',
    livePath: '/programs/healthcare',
    type: 'program',
  },
  'program-community-development': {
    title: 'Community Development',
    blurb: 'Content for /programs/community-development',
    livePath: '/programs/community-development',
    type: 'program',
  },
  'program-social-inclusion': {
    title: 'Social Inclusion',
    blurb: 'Content for /programs/social-inclusion',
    livePath: '/programs/social-inclusion',
    type: 'program',
  },
}

const ICON_OPTIONS = ['BookOpen', 'HeartPulse', 'Briefcase', 'Stethoscope', 'Home', 'Handshake']

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

export default function ProgramsCmsPage() {
  const { section } = useParams()
  const meta = PROGRAMS_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_PROGRAMS[section] || {}))
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
        const data = await fetchProgramsContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_PROGRAMS[section]), ...rest })
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
      const result = await uploadProgramsImage(file, token)
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
      const result = await updateProgramsContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_PROGRAMS[section]), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'Programs content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'Programs CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown Programs CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading programs content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Manage CMS · Programs
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
                enName="readMoreLabel"
                hiName="readMoreLabelHi"
                enLabel="Card link label (English)"
                hiLabel="Card link label (Hindi)"
              />
            </div>
          </SectionCard>
        ) : null}

        {meta.type === 'hub' ? (
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

        {meta.type === 'program' ? (
          <>
            <SectionCard title="Program identity">
              <div className="grid gap-4 sm:grid-cols-2">
                <CmsField label="Slug" hint="URL path e.g. education">
                  <input
                    name="slug"
                    value={form.slug || ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                    required
                  />
                </CmsField>
                <CmsField label="Display order">
                  <input
                    name="order"
                    type="number"
                    min="1"
                    value={form.order || 1}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
                <CmsField label="Icon">
                  <select
                    name="icon"
                    value={form.icon || 'BookOpen'}
                    onChange={handleChange}
                    className={cmsInputClass}
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </CmsField>
                <label className="flex items-end gap-2 pb-2 text-sm text-navy">
                  <input
                    type="checkbox"
                    name="showInNav"
                    checked={Boolean(form.showInNav)}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border accent-brand"
                  />
                  <span className="font-semibold">Show in website navbar</span>
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Program content">
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
                  enName="shortDescription"
                  hiName="shortDescriptionHi"
                  enLabel="Short description (English)"
                  hiLabel="Short description (Hindi)"
                  textarea
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="description"
                  hiName="descriptionHi"
                  enLabel="Full description (English)"
                  hiLabel="Full description (Hindi)"
                  textarea
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="aboutHeading"
                  hiName="aboutHeadingHi"
                  enLabel="Details heading (English)"
                  hiLabel="Details heading (Hindi)"
                />
              </div>
            </SectionCard>

            <SectionCard title="Program image">
              <ImageSourcePicker
                label="Cover image"
                value={form.image}
                uploading={uploading}
                onChange={(v) => setForm((p) => ({ ...p, image: v }))}
                onUpload={async (file) => {
                  const url = await handleUpload(file)
                  if (url) setForm((p) => ({ ...p, image: url }))
                }}
              />
            </SectionCard>

            <SectionCard title="Detail page CTAs">
              <div className="space-y-4">
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="primaryCtaLabel"
                  hiName="primaryCtaLabelHi"
                  enLabel="Primary CTA (English)"
                  hiLabel="Primary CTA (Hindi)"
                />
                <CmsField label="Primary CTA link">
                  <input
                    name="primaryCtaLink"
                    value={form.primaryCtaLink || ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="secondaryCtaLabel"
                  hiName="secondaryCtaLabelHi"
                  enLabel="Secondary CTA (English)"
                  hiLabel="Secondary CTA (Hindi)"
                />
                <CmsField label="Secondary CTA link">
                  <input
                    name="secondaryCtaLink"
                    value={form.secondaryCtaLink || ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
              </div>
            </SectionCard>
          </>
        ) : null}

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
      </form>
    </div>
  )
}
