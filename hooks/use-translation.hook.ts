import { getTranslations } from '@/lib/i18n'
import { useLanguageStore } from '@/stores/language.store'

export const useTranslation = () => {
  const language = useLanguageStore((s) => s.language)
  const t = getTranslations(language)

  return { t, language }
}
