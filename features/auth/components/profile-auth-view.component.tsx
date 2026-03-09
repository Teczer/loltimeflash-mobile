import { Ionicons } from '@expo/vector-icons'
import LanegapLogo from '@/assets/images/lanegap.svg'
import { memo, useCallback, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackgroundImage } from '@/components/background-image.component'
import { GlassButton, TitleText } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

import { LoginForm } from './login-form.component'
import { OAuthButtons } from './oauth-buttons.component'
import { RegisterForm } from './register-form.component'

export type TAuthMode = 'login' | 'register'

interface IProfileAuthViewProps {
  onOpenSettings: () => void
  onNeedOTP: (
    email: string,
    password: string,
    isNewRegistration: boolean
  ) => void
  extraBottomPadding?: number
}

export const ProfileAuthView = memo((props: IProfileAuthViewProps) => {
  const { onOpenSettings, onNeedOTP, extraBottomPadding = 0 } = props
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const [authMode, setAuthMode] = useState<TAuthMode>('login')
  const verticalPadding = insets.top + 56

  const handleSwitchToRegister = useCallback(() => {
    setAuthMode('register')
  }, [])

  const handleSwitchToLogin = useCallback(() => {
    setAuthMode('login')
  }, [])

  return (
    <BackgroundImage variant="fast">
      <View className="flex-1">
        <GlassButton
          onPress={onOpenSettings}
          className="absolute right-4 z-50"
          style={{ top: insets.top + 8 }}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={colors.foreground}
          />
        </GlassButton>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: verticalPadding,
            paddingBottom: verticalPadding + extraBottomPadding,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-6">
            <View className="items-center gap-y-10">
              <LanegapLogo width={64} height={64} color="#FFFFFF" />
              <TitleText size="sm" className="text-center">
                {t.auth.signInToAccess}
              </TitleText>
            </View>

            <View className="gap-5">
              {authMode === 'login' ? (
                <LoginForm
                  onSwitchToRegister={handleSwitchToRegister}
                  onNeedOTP={onNeedOTP}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={handleSwitchToLogin}
                  onNeedOTP={onNeedOTP}
                />
              )}

              <OAuthButtons />
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundImage>
  )
})

ProfileAuthView.displayName = 'ProfileAuthView'
