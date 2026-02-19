import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
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

  const handleOpenSettings = useCallback(() => {
    router.push('/settings')
  }, [router])

  const handleNeedOTP = useCallback(
    (email: string, password: string, isNewRegistration: boolean) => {
      router.push({
        pathname: '/verify-otp',
        params: {
          email,
          password,
          isNewRegistration: String(isNewRegistration),
        },
      })
    },
    [router]
  )

  if (isAuthenticated && user) {
    return (
      <BackgroundImage>
        <StyledSafeAreaView className="flex-1 gap-y-4" edges={['top']}>
          <GlassButton
            onPress={handleOpenSettings}
            className="absolute right-4 top-14 z-50"
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.foreground}
            />
          </GlassButton>
          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerClassName="px-6 pb-8 gap-y-4"
            showsVerticalScrollIndicator={false}
            bottomOffset={50}
          >
            <ProfileView user={user} />
          </KeyboardAwareScrollView>
        </StyledSafeAreaView>
      </BackgroundImage>
    )
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1 gap-y-4" edges={['top']}>
        <GlassButton
          onPress={handleOpenSettings}
          className="absolute right-4 top-14 z-50"
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={colors.foreground}
          />
        </GlassButton>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 gap-y-4"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
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
                onNeedOTP={handleNeedOTP}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setAuthMode('login')}
                onNeedOTP={handleNeedOTP}
              />
            )}

            <OAuthButtons />
          </View>
        </KeyboardAwareScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
