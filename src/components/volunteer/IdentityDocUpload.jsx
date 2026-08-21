import { FileText, Loader2, Upload } from 'lucide-react'
import { mediaUrl } from '../../utils/media'

function isImageUrl(url) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(String(url || ''))
}

export default function IdentityDocUpload({
  label,
  hint,
  value,
  uploading = false,
  onUpload,
  onError,
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="text-[13px] leading-5 font-semibold text-navy">{label}</p>
      <label className="mt-1.5 flex h-[88px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-border bg-muted/40 px-3 text-center transition hover:border-brand/40 hover:bg-brand-soft/30">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) return
            if (file.size > 2 * 1024 * 1024) {
              if (onError) onError('File must be 2MB or smaller.')
              else window.alert('File must be 2MB or smaller.')
              return
            }
            onUpload(file)
          }}
        />
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
        ) : (
          <Upload className="h-4 w-4 text-navy" />
        )}
        <span className="text-xs font-semibold text-navy">
          {uploading ? 'Uploading…' : value ? 'Replace file' : 'Upload scan / photo'}
        </span>
        <span className="text-[11px] text-text-muted">JPG, PNG, WEBP or PDF · max 2MB</span>
      </label>
      <span className="mt-1 min-h-4 text-[11px] leading-4 text-text-muted">{hint || '\u00a0'}</span>
      {value ? (
        <div className="mt-1.5 overflow-hidden rounded-[12px] border border-border bg-muted">
          {isImageUrl(value) ? (
            <img src={mediaUrl(value)} alt="" className="h-24 w-full bg-white object-contain" />
          ) : (
            <a
              href={mediaUrl(value)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand hover:underline"
            >
              <FileText className="h-4 w-4" />
              View uploaded document
            </a>
          )}
        </div>
      ) : null}
    </div>
  )
}
