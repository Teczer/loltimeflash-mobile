import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'
import type { TLanguage } from '@/lib/i18n'
import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language.store'

const LANGUAGE_OPTIONS: { value: TLanguage; flag: string }[] = [
  { value: 'fr', flag: '🇫🇷' },
  { value: 'en', flag: '🇬🇧' },
]

interface ILanguagePickerProps {
  compact?: boolean
}

export const LanguagePicker = (props: ILanguagePickerProps) => {
  const { compact = false } = props
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const languageLabels: Record<TLanguage, string> = {
    fr: t.settings.french,
    en: t.settings.english,
  }

  return (
    <View className="gap-y-4">
      {!compact && (
        <Text className="font-sans-bold text-foreground text-lg">
          {t.settings.language}
        </Text>
      )}

      <View className="flex-row gap-3">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = language === option.value

          return (
            <Pressable
              key={option.value}
              onPress={() => setLanguage(option.value)}
              className={cn(
                'flex-1 flex-row items-center justify-center gap-2 rounded-xl border px-4 py-3',
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 bg-white/5 active:bg-white/10'
              )}
            >
              <Text className="text-lg">{option.flag}</Text>
              <Text
                className={cn(
                  'font-sans-bold text-sm',
                  isSelected ? 'text-gold' : 'text-foreground'
                )}
              >
                {languageLabels[option.value]}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
