import { ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEFAULT_ABOUT } from '../../../../data/aboutDefaults'
import { getMasterAdminToken } from '../../data/auth'
import {
  fetchAboutContent,
  updateAboutContent,
  uploadAboutImage,
} from '../../../../services/cms'
import {
  CmsField,
  CmsToast,
  ImageSourcePicker,
  SectionCard,
  cmsInputClass,
  cmsTextareaClass,
} from './CmsUi'

export const ABOUT_CMS_SECTIONS = {
  'home-about': {
    title: 'About Section (Home)',
    blurb: 'Landing page About block — also reused on the About page.',
    livePath: '/',
  },
  'about-hub': {
    title: 'About Page',
    blurb: 'Main /about hub hero and navigation cards.',
    livePath: '/about',
  },
  'about-story': {
    title: 'Our Story',
    blurb: 'Content for /about/our-story',
    livePath: '/about/our-story',
  },
  'about-mission-vision': {
    title: 'Mission & Vision',
    blurb: 'Content for /about/mission-vision',
    livePath: '/about/mission-vision',
  },
  'about-team': {
    title: 'Our Team',
    blurb: 'Team members shown on /about/team',
    livePath: '/about/team',
  },
  'about-journey': {
    title: 'Our Journey',
    blurb: 'Milestones shown on /about/journey',
    livePath: '/about/journey',
  },
}

function emptyMember() {
  return {
    id: String(Date.now()),
    name: '',
    nameHi: '',
    role: '',
    roleHi: '',
    bio: '',
    bioHi: '',
    image: '',
  }
}

function emptyMilestone() {
  return {
    id: String(Date.now()),
    year: '',
    yearHi: '',
    title: '',
    titleHi: '',
    description: '',
    descriptionHi: '',
  }
}

function emptyParagraph() {
  return { body: '', bodyHi: '' }
}

function emptyTrust() {
  return { text: '', textHi: '' }
}

function emptyCard() {
  return {
    title: '',
    titleHi: '',
    description: '',
    descriptionHi: '',
    to: '',
  }
}

function BilingualPair({
  enName,
  hiName,
  enLabel,
  hiLabel,
  form,
  onChange,
  textarea = false,
}) {
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

export default function AboutCmsPage() {
  const { section } = useParams()
  const meta = ABOUT_CMS_SECTIONS[section]
  const [form, setForm] = useState(() => structuredClone(DEFAULT_ABOUT[section] || {}))
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
        const data = await fetchAboutContent(section)
        if (cancelled) return
        const { updatedAt: at, key: _key, ...rest } = data
        setForm({ ...structuredClone(DEFAULT_ABOUT[section]), ...rest })
        setUpdatedAt(at || null)
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load content.')
        }
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
      const result = await uploadAboutImage(file, token)
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
      const result = await updateAboutContent(section, payload, token)
      if (!result?.success) {
        setError(result?.message || 'Failed to save.')
        return
      }
      const { updatedAt: at, key: _key, ...rest } = result.data
      setForm({ ...structuredClone(DEFAULT_ABOUT[section]), ...rest })
      setUpdatedAt(at || new Date().toISOString())
      setSuccess(result.message || 'About content updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => meta?.title || 'About CMS', [meta])

  if (!meta) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
        Unknown About CMS section.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading about content...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <CmsToast message={success} onClose={clearSuccess} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">Manage CMS · About</p>
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
        {section === 'home-about' ? (
          <>
            <SectionCard title="Image & video">
              <div className="grid gap-4 lg:grid-cols-2">
                <ImageSourcePicker
                  label="About image"
                  value={form.imageUrl}
                  uploading={uploading}
                  onChange={(v) => setForm((p) => ({ ...p, imageUrl: v }))}
                  onUpload={async (file) => {
                    const url = await handleUpload(file)
                    if (url) setForm((p) => ({ ...p, imageUrl: url }))
                  }}
                />
                <div className="space-y-4">
                  <BilingualPair
                    form={form}
                    onChange={handleChange}
                    enName="imageAlt"
                    hiName="imageAltHi"
                    enLabel="Alt text (English)"
                    hiLabel="Alt text (Hindi)"
                  />
                  <CmsField label="Intro video embed URL" hint="YouTube embed URL">
                    <input
                      name="introVideoEmbed"
                      value={form.introVideoEmbed || ''}
                      onChange={handleChange}
                      className={cmsInputClass}
                    />
                  </CmsField>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Section content">
              <div className="space-y-4">
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="sectionLabel"
                  hiName="sectionLabelHi"
                  enLabel="Section label (English)"
                  hiLabel="Section label (Hindi)"
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
                  enName="body"
                  hiName="bodyHi"
                  enLabel="Body (English)"
                  hiLabel="Body (Hindi)"
                  textarea
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="ctaLabel"
                  hiName="ctaLabelHi"
                  enLabel="CTA label (English)"
                  hiLabel="CTA label (Hindi)"
                />
                <CmsField label="CTA link">
                  <input
                    name="ctaLink"
                    value={form.ctaLink || ''}
                    onChange={handleChange}
                    className={cmsInputClass}
                  />
                </CmsField>
              </div>
            </SectionCard>

            <SectionCard title="Trust points">
              <div className="space-y-3">
                {(form.trustPoints || []).map((item, index) => (
                  <div
                    key={`trust-${index}`}
                    className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      value={item.text || ''}
                      onChange={(e) => updateList('trustPoints', index, 'text', e.target.value)}
                      className={cmsInputClass}
                      placeholder="English"
                    />
                    <input
                      value={item.textHi || ''}
                      onChange={(e) => updateList('trustPoints', index, 'textHi', e.target.value)}
                      className={cmsInputClass}
                      placeholder="Hindi"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('trustPoints', index)}
                      className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      aria-label="Remove trust point"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('trustPoints', emptyTrust)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Add trust point
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Mission & Vision cards">
              <div className="space-y-4">
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="missionTitle"
                  hiName="missionTitleHi"
                  enLabel="Mission title (English)"
                  hiLabel="Mission title (Hindi)"
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="missionBody"
                  hiName="missionBodyHi"
                  enLabel="Mission body (English)"
                  hiLabel="Mission body (Hindi)"
                  textarea
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="visionTitle"
                  hiName="visionTitleHi"
                  enLabel="Vision title (English)"
                  hiLabel="Vision title (Hindi)"
                />
                <BilingualPair
                  form={form}
                  onChange={handleChange}
                  enName="visionBody"
                  hiName="visionBodyHi"
                  enLabel="Vision body (English)"
                  hiLabel="Vision body (Hindi)"
                  textarea
                />
              </div>
            </SectionCard>
          </>
        ) : null}

        {section === 'about-hub' ? (
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
                  enName="exploreLabel"
                  hiName="exploreLabelHi"
                  enLabel="Card CTA (English)"
                  hiLabel="Card CTA (Hindi)"
                />
              </div>
            </SectionCard>
            <SectionCard title="Subpage cards">
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
                        onChange={(e) => updateList('cards', index, 'descriptionHi', e.target.value)}
                      />
                      <input
                        className={`${cmsInputClass} sm:col-span-2`}
                        placeholder="Link e.g. /about/our-story"
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

        {section === 'about-story' ? (
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
            <SectionCard title="Story paragraphs">
              <div className="space-y-4">
                {(form.paragraphs || []).map((para, index) => (
                  <div key={`para-${index}`} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-navy">Paragraph {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeListItem('paragraphs', index)}
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="English"
                      value={para.body || ''}
                      onChange={(e) => updateList('paragraphs', index, 'body', e.target.value)}
                    />
                    <textarea
                      className={cmsTextareaClass}
                      placeholder="Hindi"
                      value={para.bodyHi || ''}
                      onChange={(e) => updateList('paragraphs', index, 'bodyHi', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('paragraphs', emptyParagraph)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Add paragraph
                </button>
              </div>
            </SectionCard>
          </>
        ) : null}

        {section === 'about-mission-vision' ? (
          <SectionCard title="Mission & Vision page">
            <div className="space-y-4">
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroLabel"
                hiName="heroLabelHi"
                enLabel="Hero label (English)"
                hiLabel="Hero label (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroTitle"
                hiName="heroTitleHi"
                enLabel="Hero title (English)"
                hiLabel="Hero title (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="heroDescription"
                hiName="heroDescriptionHi"
                enLabel="Hero description (English)"
                hiLabel="Hero description (Hindi)"
                textarea
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="missionTitle"
                hiName="missionTitleHi"
                enLabel="Mission title (English)"
                hiLabel="Mission title (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="missionBody"
                hiName="missionBodyHi"
                enLabel="Mission body (English)"
                hiLabel="Mission body (Hindi)"
                textarea
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="visionTitle"
                hiName="visionTitleHi"
                enLabel="Vision title (English)"
                hiLabel="Vision title (Hindi)"
              />
              <BilingualPair
                form={form}
                onChange={handleChange}
                enName="visionBody"
                hiName="visionBodyHi"
                enLabel="Vision body (English)"
                hiLabel="Vision body (Hindi)"
                textarea
              />
            </div>
          </SectionCard>
        ) : null}

        {section === 'about-team' ? (
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
            <SectionCard title="Team members">
              <div className="space-y-4">
                {(form.members || []).map((member, index) => (
                  <div key={member.id || index} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-navy">Member {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeListItem('members', index)}
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={cmsInputClass}
                        placeholder="Name EN"
                        value={member.name || ''}
                        onChange={(e) => updateList('members', index, 'name', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Name HI"
                        value={member.nameHi || ''}
                        onChange={(e) => updateList('members', index, 'nameHi', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Role EN"
                        value={member.role || ''}
                        onChange={(e) => updateList('members', index, 'role', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Role HI"
                        value={member.roleHi || ''}
                        onChange={(e) => updateList('members', index, 'roleHi', e.target.value)}
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Bio EN"
                        value={member.bio || ''}
                        onChange={(e) => updateList('members', index, 'bio', e.target.value)}
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Bio HI"
                        value={member.bioHi || ''}
                        onChange={(e) => updateList('members', index, 'bioHi', e.target.value)}
                      />
                    </div>
                    <ImageSourcePicker
                      label="Member photo"
                      value={member.image}
                      uploading={uploading}
                      onChange={(v) => updateList('members', index, 'image', v)}
                      onUpload={async (file) => {
                        const url = await handleUpload(file)
                        if (url) updateList('members', index, 'image', url)
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('members', emptyMember)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Add member
                </button>
              </div>
            </SectionCard>
          </>
        ) : null}

        {section === 'about-journey' ? (
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
            <SectionCard title="Milestones">
              <div className="space-y-4">
                {(form.milestones || []).map((item, index) => (
                  <div key={item.id || index} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-navy">Milestone {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeListItem('milestones', index)}
                        className="rounded-lg border border-border p-2 text-brand hover:bg-brand-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={cmsInputClass}
                        placeholder="Year / label EN"
                        value={item.year || ''}
                        onChange={(e) => updateList('milestones', index, 'year', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Year / label HI"
                        value={item.yearHi || ''}
                        onChange={(e) => updateList('milestones', index, 'yearHi', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Title EN"
                        value={item.title || ''}
                        onChange={(e) => updateList('milestones', index, 'title', e.target.value)}
                      />
                      <input
                        className={cmsInputClass}
                        placeholder="Title HI"
                        value={item.titleHi || ''}
                        onChange={(e) => updateList('milestones', index, 'titleHi', e.target.value)}
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Description EN"
                        value={item.description || ''}
                        onChange={(e) =>
                          updateList('milestones', index, 'description', e.target.value)
                        }
                      />
                      <textarea
                        className={cmsTextareaClass}
                        placeholder="Description HI"
                        value={item.descriptionHi || ''}
                        onChange={(e) =>
                          updateList('milestones', index, 'descriptionHi', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('milestones', emptyMilestone)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Add milestone
                </button>
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
            <span className="font-semibold">Show this section on the website</span>
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
