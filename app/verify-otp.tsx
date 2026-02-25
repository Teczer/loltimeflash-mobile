import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackgroundImage } from '@/components/background-image.component'
import { GlassButton } from '@/components/ui'
import { OTPActions, OTPHeader, OTPInput } from '@/features/auth/components'
import { useSendOTP, useVerifyOTP } from '@/features/auth/hooks/use-otp.hook'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

export default function VerifyOTPScreen() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{
    email: string
    password: string
    isNewRegistration: string
  }>()

  const email = params.email ?? ''
  const password = params.password ?? ''
  const isNewRegistration = params.isNewRegistration === 'true'

  const [code, setCode] = useState('')
  const [hasError, setHasError] = useState(false)
  const login = useAuthStore((s) => s.login)

  const { mutateAsync: verifyOTP, isPending: isVerifying } = useVerifyOTP()
  const { mutateAsync: resendOTP, isPending: isResending } = useSendOTP()

  const handleBack = useCallback(() => {
    router.back()
  }, [])

  const handleVerify = useCallback(
    async (otpCode?: string) => {
      const codeToVerify = otpCode || code
      if (codeToVerify.length < 6) {
        setHasError(true)
        return
      }

      try {
        await verifyOTP({ email, code: codeToVerify })
        await login({ email, password })
        if (isNewRegistration) {
          router.replace('/onboarding')
        } else {
          router.back()
        }
      } catch {
        setHasError(true)
        Alert.alert(t.game.error, t.auth.otpInvalid)
        setCode('')
      }
    },
    [code, email, password, isNewRegistration, verifyOTP, login, t]
  )

  const handleResend = useCallback(async () => {
    try {
      await resendOTP(email)
      Alert.alert('', t.auth.resendSuccess)
    } catch {
      Alert.alert(t.game.error, t.auth.sendOtpError)
    }
  }, [email, resendOTP, t])

  const handleChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      if (hasError) setHasError(false)
    },
    [hasError]
  )

  const isLoading = isVerifying || isResending

  return (
    <BackgroundImage variant="fast">
      <View
        className="flex-1"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="px-4 py-3">
          <GlassButton fallbackGlass={false} hitSlop={16} onPress={handleBack}>
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colors.foreground}
            />
          </GlassButton>
        </View>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="flex-1 items-center justify-center gap-10 px-8"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          <OTPHeader email={email} />

          <OTPInput
            value={code}
            onChange={handleChange}
            onComplete={handleVerify}
            disabled={isLoading}
            error={hasError}
          />

          <OTPActions
            onVerify={() => handleVerify()}
            onResend={handleResend}
            isVerifyDisabled={isLoading || code.length < 6}
            isVerifying={isVerifying}
            isResending={isResending}
          />
        </KeyboardAwareScrollView>
      </View>
    </BackgroundImage>
  )
}
