import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { AppInfo } from '@/components/app-info.component'
import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton, TitleText } from '@/components/ui'
import {
  BackgroundPicker,
  LanguagePicker,
  UsernameForm,
} from '@/features/settings/components'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

export default function SettingsScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1 gap-y-6" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center gap-4 px-4 py-3">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>
          <TitleText size="md">{t.settings.title}</TitleText>
        </View>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 gap-y-2"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          <UsernameForm />
          <LanguagePicker />
          <BackgroundPicker />
        </KeyboardAwareScrollView>

        <AppInfo />
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
