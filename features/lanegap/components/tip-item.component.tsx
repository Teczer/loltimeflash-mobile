import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'

interface ITipItemProps {
  tip: string
  index: number
}

export const TipItem = ({ tip }: ITipItemProps) => (
  <View className="flex-row items-start gap-2.5">
    <View className="mt-0.5">
      <Ionicons name="chevron-forward" size={16} color={colors.goldLight} />
    </View>
    <Text className="flex-1 text-sm leading-relaxed text-white/80">{tip}</Text>
  </View>
)
