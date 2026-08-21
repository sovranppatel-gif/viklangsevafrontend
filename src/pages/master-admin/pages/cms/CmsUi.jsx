import { CheckCircle2, Link2, Loader2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { mediaUrl } from '../../../../utils/media'
import ImageCropModal from './ImageCropModal'

export const cmsInputClass =
  'h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-text outline-none transition duration-200 hover:border-navy/20 focus:border-brand focus:ring-2 focus:ring-brand/15'

export const cmsTextareaClass = `${cmsInputClass} h-auto min-h-[72px] resize-y py-2.5`

export function CmsField({ label, hint, children, className = '' }) {
  return (
    <label className={`flex min-w-0 flex-col ${className}`}>
      <span className="text-[13px] leading-5 font-semibold text-navy">{label}</span>
      <div className="mt-1.5">{children}</div>
      <span className="mt-1 min-h-4 text-[11px] leading-4 text-text-muted">
        {hint || '\u00a0'}
      </span>
    </label>
  )
}

export function CmsToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-[80] w-[min(100%-2rem,22rem)] rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg shadow-navy/10"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="flex-1 text-sm font-medium text-emerald-800">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-emerald-700/70 transition hover:bg-emerald-50 hover:text-emerald-900"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ImageSourcePicker({
  value,
  onChange,
  onUpload,
  uploading = false,
  label = 'Image',
  previewClassName = 'h-36 w-full object-cover',
  cropAspect = 1,
  lockCropAspect = false,
  allowUrl = true,
}) {
  const [mode, setMode] = useState(String(value || '').includes('/uploads/') ? 'upload' : 'url')
  const [cropSrc, setCropSrc] = useState('')
  const [cropFile, setCropFile] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    return () => {
      if (cropSrc) URL.revokeObjectURL(cropSrc)
    }
  }, [cropSrc])

  function closeCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc('')
    setCropFile(null)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !onUpload) return
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropFile(file)
    setCropSrc(URL.createObjectURL(file))
  }

  async function handleCroppedUpload(file) {
    await onUpload(file)
    closeCrop()
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        <div className="mt-2 inline-flex rounded-xl border border-border bg-muted/60 p-1" role="tablist">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'upload' || !allowUrl ? 'bg-white text-navy shadow-sm' : 'text-text-muted hover:text-navy'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload photo
          </button>
          {allowUrl ? (
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === 'url' ? 'bg-white text-navy shadow-sm' : 'text-text-muted hover:text-navy'
              }`}
            >
              <Link2 className="h-3.5 w-3.5" />
              Image URL
            </button>
          ) : null}
        </div>
      </div>

      {mode === 'upload' || !allowUrl ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFile}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-border bg-muted/40 px-3 py-4 text-center transition hover:border-brand/40 hover:bg-brand-soft/30 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
            ) : (
              <Upload className="h-5 w-5 text-navy" />
            )}
            <span className="text-sm font-semibold text-navy">
              {uploading ? 'Uploading...' : 'Click to upload photo'}
            </span>
            <span className="text-xs text-text-muted">JPG, PNG, WEBP or GIF · max 5MB</span>
          </button>
          {value ? <p className="mt-2 truncate text-xs text-text-muted">Current: {value}</p> : null}
        </div>
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cmsInputClass}
          placeholder="https://..."
        />
      )}

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <img src={mediaUrl(value)} alt="Preview" className={previewClassName} />
        </div>
      ) : null}

      {cropSrc && cropFile ? (
        <ImageCropModal
          src={cropSrc}
          file={cropFile}
          aspect={cropAspect}
          lockAspect={lockCropAspect}
          uploading={uploading}
          onCancel={closeCrop}
          onUpload={handleCroppedUpload}
        />
      ) : null}
    </div>
  )
}

export function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
      {title ? <h3 className="mb-4 text-base font-bold text-navy">{title}</h3> : null}
      {children}
    </section>
  )
}
