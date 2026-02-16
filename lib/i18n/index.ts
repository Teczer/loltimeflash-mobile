import { en } from './en'
import { fr } from './fr'
import type { ITranslations, TLanguage } from './types'

const translations: Record<TLanguage, ITranslations> = {
  en,
  fr,
}

export function getTranslations(language: TLanguage): ITranslations {
  return translations[language] || translations.en
}

export type { ILocalizedText, ITranslations, TLanguage } from './types'
export { SUPPORTED_LANGUAGES } from './types'
