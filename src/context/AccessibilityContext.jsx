import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [textScale, setTextScale] = useState(1)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(textScale))
  }, [textScale])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  const value = useMemo(
    () => ({
      textScale,
      highContrast,
      increaseText: () => setTextScale((scale) => Math.min(1.3, Number((scale + 0.1).toFixed(1)))),
      decreaseText: () => setTextScale((scale) => Math.max(0.9, Number((scale - 0.1).toFixed(1)))),
      toggleHighContrast: () => setHighContrast((value) => !value),
      readAloud: () => {
        if (!('speechSynthesis' in window)) return
        window.speechSynthesis.cancel()
        const main = document.querySelector('main')
        const text = main?.innerText?.slice(0, 1200) || document.body.innerText.slice(0, 1200)
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-IN'
        window.speechSynthesis.speak(utterance)
      },
      stopReading: () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      },
    }),
    [textScale, highContrast],
  )

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
