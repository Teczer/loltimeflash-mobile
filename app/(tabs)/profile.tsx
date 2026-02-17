import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton, TitleText } from '@/components/ui'
import {
  LoginForm,
  OAuthButtons,
  ProfileView,
  RegisterForm,
} from '@/features/auth/components'
import {
  BackgroundPicker,
  LanguagePicker,
  UsernameForm,
} from '@/features/settings/components'
import { AppInfo } from '@/components/app-info.component'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

type TAuthMode = 'login' | 'register'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [authMode, setAuthMode] = useState<TAuthMode>('login')

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1 gap-y-4" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TitleText size="md">{t.auth.profile}</TitleText>
          <GlassButton onPress={() => router.push('/settings')}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.foreground}
            />
          </GlassButton>
        </View>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 gap-y-4"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          {isAuthenticated && user ? (
            <>
              <ProfileView user={user} />
              <View className="mt-2 gap-2">
                <UsernameForm />
              </View>
            </>
          ) : (
            <View className="gap-6 pt-4">
              <View className="items-center gap-2">
                <Ionicons
                  name="person-circle-outline"
                  size={64}
                  color={colors.gold}
                />
                <TitleText size="sm">{t.auth.signInToAccess}</TitleText>
              </View>

              {authMode === 'login' ? (
                <LoginForm
                  onSwitchToRegister={() => setAuthMode('register')}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              )}

              <OAuthButtons />
            </View>
          )}

          <AppInfo />
        </KeyboardAwareScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
