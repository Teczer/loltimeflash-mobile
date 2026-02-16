import { getLocales } from 'expo-localization'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { TLanguage } from '@/lib/i18n/types'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/types'
import { mmkvStorage } from '@/lib/mmkvStorage'

function getDeviceLanguage(): TLanguage {
  const locales = getLocales()
  const deviceLang = locales[0]?.languageCode

  if (deviceLang && SUPPORTED_LANGUAGES.includes(deviceLang as TLanguage)) {
    return deviceLang as TLanguage
  }

  return 'en'
}

interface ILanguageState {
  language: TLanguage
}

interface ILanguageActions {
  setLanguage: (language: TLanguage) => void
}

const DEFAULT_STATE: ILanguageState = {
  language: getDeviceLanguage(),
}

export const useLanguageStore = create<ILanguageState & ILanguageActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
