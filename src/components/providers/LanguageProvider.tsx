import { useState, useEffect, ReactNode } from 'react'
import { LanguageContext } from '@/contexts/LanguageContext'
import { detectBrowserLanguage, getTranslation, TranslationKey } from '@/lib/i18n'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferred-language')
    return saved || detectBrowserLanguage()
  })

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key: TranslationKey) => getTranslation(key, language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}