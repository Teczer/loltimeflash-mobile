import { memo, useMemo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import { getChampionIcon } from '@/assets/champions'
import { cn } from '@/lib/utils'

import { TIER_COLORS, type TTier } from '../types'

interface ICounterPickCardProps {
  championId: string
  championName: string
  tier: TTier
  onPress?: () => void
}

/**
 * Counter pick card matching web style
 * Web: rounded-xl p-3, bg-card border border-white/10
 */
const CounterPickCardComponent = ({
  championId,
  championName,
  tier,
  onPress,
}: ICounterPickCardProps) => {
  const iconSource = useMemo(() => getChampionIcon(championId), [championId])
  const tierColor = TIER_COLORS[tier]
  const tierBase = tier.replace(/[+-]/, '')
  const isHighTier = tierBase === 'S' || tier === 'S+'

  return (
    <Pressable onPress={onPress} className="items-center">
      <View className="items-center rounded-xl border border-white/10 bg-[#191a22] px-5 py-3">
        {/* Champion Icon with Tier Badge */}
        <View className="relative mb-2">
          {iconSource && (
            <Image
              source={iconSource}
              className="size-12 rounded-lg"
              resizeMode="cover"
            />
          )}

          {/* Tier Badge */}
          <View
            className={cn(
              'absolute -bottom-1.5 -right-1.5',
              'size-7 items-center justify-center rounded-lg',
              'border border-white/20'
            )}
            style={{ backgroundColor: tierColor }}
          >
            <Text
              className={cn(
                'text-[11px] font-bold',
                isHighTier ? 'text-slate-800' : 'text-white'
              )}
            >
              {tier}
            </Text>
          </View>
        </View>

        {/* Champion Name */}
        <Text className="text-center text-xs text-white/70" numberOfLines={1}>
          {championName}
        </Text>
      </View>
    </Pressable>
  )
}

export const CounterPickCard = memo(CounterPickCardComponent)
