import { Accessibility, Contrast, Minus, Plus, Volume2, VolumeX, X } from 'lucide-react'
import { useState } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const {
    increaseText,
    decreaseText,
    toggleHighContrast,
    highContrast,
    readAloud,
    stopReading,
  } = useAccessibility()

  return (
    <div className="float-corner fixed left-3 z-40 md:left-6">
      {open ? (
        <div className="mb-3 w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl border border-border bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-navy">Accessibility</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-text-muted hover:bg-muted"
              aria-label="Close accessibility panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2">
            <button type="button" className="btn-outline justify-start px-3 py-2" onClick={increaseText}>
              <Plus className="h-4 w-4" /> Increase Text
            </button>
            <button type="button" className="btn-outline justify-start px-3 py-2" onClick={decreaseText}>
              <Minus className="h-4 w-4" /> Decrease Text
            </button>
            <button
              type="button"
              className="btn-outline justify-start px-3 py-2"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
            >
              <Contrast className="h-4 w-4" /> High Contrast
            </button>
            <button type="button" className="btn-outline justify-start px-3 py-2" onClick={readAloud}>
              <Volume2 className="h-4 w-4" /> Read Aloud
            </button>
            <button type="button" className="btn-outline justify-start px-3 py-2" onClick={stopReading}>
              <VolumeX className="h-4 w-4" /> Stop Reading
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-xl transition hover:bg-navy-light sm:h-14 sm:w-14"
        aria-label="Open accessibility controls"
        aria-expanded={open}
      >
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  )
}
