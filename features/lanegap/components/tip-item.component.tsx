import { colors } from '@/lib/colors'
import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Text, View } from 'react-native'

interface ITipItemProps {
  tip: string
  index: number
}

/**
 * Tip item matching web's TipList
 * Web: flex items-start gap-2.5 text-white/80
 * Chevron: text-primary-light (blue-400)
 */
const TipItemComponent = ({ tip }: ITipItemProps) => (
  <View className="flex-row items-start gap-2.5">
    <View className="mt-0.5">
      <Ionicons name="chevron-forward" size={16} color={colors.goldLight} />
    </View>
    <Text className="flex-1 text-sm leading-relaxed text-white/80">{tip}</Text>
  </View>
)

export const TipItem = memo(TipItemComponent)
