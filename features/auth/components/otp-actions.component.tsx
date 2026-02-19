import { memo } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

import { DynamicButton } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

interface IOTPActionsProps {
  onVerify: () => void
  onResend: () => void
  isVerifyDisabled: boolean
  isVerifying: boolean
  isResending: boolean
}

const OTPActionsComponent = (props: IOTPActionsProps) => {
  const { onVerify, onResend, isVerifyDisabled, isVerifying, isResending } =
    props
  const { t } = useTranslation()
  const isLoading = isVerifying || isResending

  return (
    <View className="w-full gap-5">
      <DynamicButton
        onPress={onVerify}
        disabled={isVerifyDisabled}
        isLoading={isVerifying}
        loadingText={t.auth.verifyButton}
        size="lg"
      >
        {t.auth.verifyButton}
      </DynamicButton>

      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-muted-foreground font-sans text-base">
          {t.auth.didntReceive}
        </Text>
        <Pressable onPress={onResend} disabled={isLoading} hitSlop={8}>
          {isResending ? (
            <ActivityIndicator size="small" color={colors.gold} />
          ) : (
            <Text className="text-gold font-sans-bold text-base">
              {t.auth.resendCode}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}

export const OTPActions = memo(OTPActionsComponent)
