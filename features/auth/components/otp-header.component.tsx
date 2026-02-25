import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Text, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

interface IOTPHeaderProps {
  email: string
}

const OTPHeaderComponent = (props: IOTPHeaderProps) => {
  const { email } = props
  const { t } = useTranslation()

  return (
    <View className="items-center gap-4">
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 96,
          height: 96,
          backgroundColor: 'rgba(196,161,91,0.15)',
        }}
      >
        <Ionicons name="mail-outline" size={48} color={colors.gold} />
      </View>
      <Text className="text-foreground font-sans-bold text-2xl">
        {t.auth.verifyEmail}
      </Text>
      <Text className="text-muted-foreground text-center font-sans text-base">
        {t.auth.otpSentTo}
      </Text>
      <Text className="text-gold font-sans-medium text-base">{email}</Text>
    </View>
  )
}

export const OTPHeader = memo(OTPHeaderComponent)
