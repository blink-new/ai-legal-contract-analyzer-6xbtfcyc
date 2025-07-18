import { createContext } from 'react'
import { TranslationKey } from '@/lib/i18n'

export interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: TranslationKey) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)