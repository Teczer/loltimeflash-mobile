import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { AppInfo } from '@/components/app-info.component'
import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton, TitleText } from '@/components/ui'
import { BackgroundPicker, UsernameForm } from '@/features/settings/components'
import { colors } from '@/lib/colors'
import { useUserStore } from '@/stores'

export default function SettingsScreen() {
  const router = useRouter()
  const clearUsername = useUserStore((s) => s.clearUsername)

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1 gap-y-6" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center gap-4 px-4 py-3">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>
          <TitleText size="md">Settings</TitleText>
        </View>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 gap-y-2"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          <UsernameForm />
          <BackgroundPicker />

          {/* DEV: Clear username button */}
          <View className="mt-8 items-center">
            <GlassButton onPress={clearUsername} className="flex-row gap-2">
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text className="font-sans text-xs text-red-500">
                Clear username (dev)
              </Text>
            </GlassButton>
          </View>
        </KeyboardAwareScrollView>

        <AppInfo />
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
