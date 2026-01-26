import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import type { ILevelSpike } from '../types'

interface ILevelSpikeItemProps {
  spike: ILevelSpike
}

/**
 * Level spike item matching web's LevelSpikeTimeline
 * Web important: from-warning/15 to-accent-gold/10 ring-warning/30 bg-linear-to-br ring-1
 * Web normal: bg-muted
 * Web badge important: from-warning to-accent-gold bg-linear-to-br
 * Web badge normal: bg-primary-muted text-primary-light
 */
const LevelSpikeItemComponent = ({ spike }: ILevelSpikeItemProps) => {
  if (spike.important) {
    return (
      <View className="border-warning/30 bg-linear-to-br from-warning/15 to-accent-gold/10 flex-row items-start gap-3 rounded-lg border p-3">
        {/* Level Badge - gradient for important */}
        <View className="bg-linear-to-br from-warning to-accent-gold shadow-warning/30 size-7 items-center justify-center rounded-md shadow-lg">
          <Text className="text-xs font-bold text-white">{spike.level}</Text>
        </View>

        {/* Text */}
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-medium leading-relaxed text-white">
            {spike.text}
          </Text>
        </View>

        {/* Star icon for important */}
        <Ionicons name="star" size={16} color={colors.warning} />
      </View>
    )
  }

  return (
    <View className="bg-primary-muted flex-row items-start gap-3 rounded-lg p-3">
      {/* Level Badge - muted for normal (bg-primary-muted text-primary-light) */}
      <View className="bg-primary-muted size-7 items-center justify-center rounded-md">
        <Text className="text-primary-light text-xs font-bold">
          {spike.level}
        </Text>
      </View>

      {/* Text */}
      <View className="min-w-0 flex-1">
        <Text className="text-sm leading-relaxed text-white/70">
          {spike.text}
        </Text>
      </View>
    </View>
  )
}

export const LevelSpikeItem = memo(LevelSpikeItemComponent)
