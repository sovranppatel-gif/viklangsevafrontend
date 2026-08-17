import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const hide = window.setTimeout(() => setLeaving(true), 1800)
    const done = window.setTimeout(() => onFinish?.(), 2300)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(done)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading website"
    >
      <img
        src="/logo.png"
        alt="Viklang Sewa Sansthan"
        className="h-24 w-auto object-contain sm:h-28"
      />
      <div className="mt-8 flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="splash-dot"
            style={{ animationDelay: `${index * 0.14}s` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
