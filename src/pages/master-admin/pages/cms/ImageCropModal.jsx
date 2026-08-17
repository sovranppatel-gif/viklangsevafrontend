import { Loader2, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { getCroppedImageFile } from '../../../../utils/cropImage'

const ASPECT_OPTIONS = [
  { id: '1', label: '1:1', value: 1 },
  { id: '43', label: '4:3', value: 4 / 3 },
  { id: '169', label: '16:9', value: 16 / 9 },
  { id: 'original', label: 'Original', value: 'original' },
]

export default function ImageCropModal({
  src,
  file,
  aspect = 1,
  lockAspect = false,
  uploading = false,
  onCancel,
  onUpload,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [naturalAspect, setNaturalAspect] = useState(aspect)
  const [aspectId, setAspectId] = useState('1')
  const [error, setError] = useState('')
  const [cropping, setCropping] = useState(false)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape' && !uploading && !cropping) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, uploading, cropping])

  const selectedAspect = lockAspect
    ? aspect
    : aspectId === 'original'
      ? naturalAspect
      : ASPECT_OPTIONS.find((item) => item.id === aspectId)?.value || aspect

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleMediaLoaded = useCallback((mediaSize) => {
    if (mediaSize?.naturalWidth && mediaSize?.naturalHeight) {
      setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight)
    }
  }, [])

  async function handleUpload() {
    if (!croppedAreaPixels || !file) return
    setError('')
    setCropping(true)
    try {
      const croppedFile = await getCroppedImageFile(src, croppedAreaPixels, file)
      await onUpload(croppedFile)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not crop image.')
    } finally {
      setCropping(false)
    }
  }

  const busy = uploading || cropping

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy/60"
        aria-label="Close crop"
        disabled={busy}
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-crop-title"
        className="relative z-[91] flex max-h-[min(92vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 id="image-crop-title" className="text-base font-bold text-navy">
              Crop photo
            </h2>
            <p className="text-xs text-text-muted">Drag to move, scroll or use the slider to zoom</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg p-1.5 text-text-muted transition hover:bg-muted hover:text-navy disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[min(52vh,380px)] bg-[#111827]">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={selectedAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={handleMediaLoaded}
            showGrid
          />
        </div>

        <div className="space-y-3 border-t border-border px-4 py-4">
          {!lockAspect ? (
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={busy}
                  onClick={() => setAspectId(option.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    aspectId === option.id
                      ? 'bg-navy text-white'
                      : 'bg-muted text-text-muted hover:text-navy'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          <label className="flex items-center gap-3 text-sm text-navy">
            <span className="w-12 shrink-0 text-xs font-semibold text-text-muted">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              disabled={busy}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-2 w-full accent-brand"
            />
          </label>

          {error ? <p className="text-sm text-brand">{error}</p> : null}

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-muted hover:text-navy disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy || !croppedAreaPixels}
              onClick={handleUpload}
              className="btn-primary !w-auto !rounded-xl !px-4 !py-2.5"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading…' : cropping ? 'Cropping…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
