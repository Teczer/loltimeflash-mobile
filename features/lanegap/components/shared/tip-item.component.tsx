import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import { ICON_SIZES } from '@/features/lanegap/constants'

interface ITipItemProps {
  tip: string
  index: number
}

export const TipItem = ({ tip }: ITipItemProps) => (
  <View className="flex-row items-start gap-2.5">
    <View className="mt-0.5">
      <Ionicons name="chevron-forward" size={ICON_SIZES.sm} color={colors.goldLight} />
    </View>
    <Text className="flex-1 text-sm leading-relaxed text-white/80">{tip}</Text>
  </View>
)
