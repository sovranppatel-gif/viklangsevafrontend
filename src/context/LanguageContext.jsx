import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('vss-lang') === 'hi' ? 'hi' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('vss-lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      isHi: lang === 'hi',
      setLang,
      toggleLang: () => setLang((current) => (current === 'hi' ? 'en' : 'hi')),
      t: (en, hi) => (lang === 'hi' ? hi || en : en),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
