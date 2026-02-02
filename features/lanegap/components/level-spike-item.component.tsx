import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import type { ILevelSpike } from '@/features/lanegap/types'

interface ILevelSpikeItemProps {
  spike: ILevelSpike
}

export const LevelSpikeItem = ({ spike }: ILevelSpikeItemProps) => {
  if (spike.important) {
    return (
      <View className="border-warning/30 bg-linear-to-br from-warning/15 to-accent-gold/10 flex-row items-start gap-3 rounded-lg border p-3">
        <View className="bg-linear-to-br from-warning to-accent-gold shadow-warning/30 size-7 items-center justify-center rounded-md shadow-lg">
          <Text className="text-xs font-bold text-white">{spike.level}</Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text className="text-sm font-medium leading-relaxed text-white">
            {spike.text}
          </Text>
        </View>

        <Ionicons name="star" size={16} color={colors.warning} />
      </View>
    )
  }

  return (
    <View className="bg-primary-muted flex-row items-start gap-3 rounded-lg p-3">
      <View className="bg-primary-muted size-7 items-center justify-center rounded-md">
        <Text className="text-primary-light text-xs font-bold">
          {spike.level}
        </Text>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-sm leading-relaxed text-white/70">
          {spike.text}
        </Text>
      </View>
    </View>
  )
}
