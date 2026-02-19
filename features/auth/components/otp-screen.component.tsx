import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'

import { Button } from '@/components/ui'
import { OTPInput } from '@/features/auth/components/otp-input.component'
import { useSendOTP, useVerifyOTP } from '@/features/auth/hooks/use-otp.hook'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

interface IOTPScreenProps {
  email: string
  password: string
  onVerified: () => void
  onBack: () => void
}

const OTPScreenComponent = (props: IOTPScreenProps) => {
  const { email, password, onVerified, onBack } = props
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [hasError, setHasError] = useState(false)
  const login = useAuthStore((s) => s.login)

  const { mutateAsync: verifyOTP, isPending: isVerifying } = useVerifyOTP()
  const { mutateAsync: resendOTP, isPending: isResending } = useSendOTP()

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
        onVerified()
      } catch {
        setHasError(true)
        Alert.alert(t.game.error, t.auth.otpInvalid)
        setCode('')
      }
    },
    [code, email, password, verifyOTP, login, onVerified, t],
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
    [hasError],
  )

  const isLoading = isVerifying || isResending

  return (
    <View className="items-center gap-8 pt-8">
      <Pressable
        onPress={onBack}
        className="absolute left-0 top-2"
        hitSlop={16}
      >
        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
      </Pressable>

      <View className="items-center gap-3">
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 80, height: 80, backgroundColor: 'rgba(196,161,91,0.15)' }}
        >
          <Ionicons name="mail-outline" size={40} color={colors.gold} />
        </View>
        <Text className="text-foreground font-sans-bold text-xl">
          {t.auth.verifyEmail}
        </Text>
        <Text className="text-muted-foreground text-center font-sans text-sm">
          {t.auth.otpSentTo}
        </Text>
        <Text className="text-gold font-sans-medium text-sm">{email}</Text>
      </View>

      <OTPInput
        value={code}
        onChange={handleChange}
        onComplete={handleVerify}
        disabled={isLoading}
        error={hasError}
      />

      <View className="w-full gap-4">
        <Button
          onPress={() => handleVerify()}
          disabled={isLoading || code.length < 6}
          icon={
            isVerifying ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : undefined
          }
        >
          {t.auth.verifyButton}
        </Button>

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-muted-foreground font-sans text-sm">
            {t.auth.didntReceive}
          </Text>
          <Pressable onPress={handleResend} disabled={isLoading} hitSlop={8}>
            {isResending ? (
              <ActivityIndicator size="small" color={colors.gold} />
            ) : (
              <Text className="text-gold font-sans-bold text-sm">
                {t.auth.resendCode}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export const OTPScreen = memo(OTPScreenComponent)
