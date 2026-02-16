import type { ReactNode } from 'react'
import { memo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import { getChampionIcon } from '@/assets/champions'
import { cn } from '@/lib/utils'

import {
  ATierGlow,
  SPlusTierBeam,
  STierBeam,
} from '@/features/lanegap/components/effects'
import {
  TIER_COLORS,
  type TTier,
  type TTierBase,
} from '@/features/lanegap/types'

// =============================================================================
// Constants
// =============================================================================

const BORDER_RADIUS = 12

// =============================================================================
// Types
// =============================================================================

interface ICounterPickCardProps {
  championId: string
  championName: string
  tier: TTier
  onPress?: () => void
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the base tier (without +/-) for effect selection
 */
const getTierBase = (tier: TTier): TTierBase => {
  if (tier === 'S+') return 'S+'
  return tier.replace(/[+-]/, '') as TTierBase
}

// =============================================================================
// Inner Components
// =============================================================================

interface ITierWrapperProps {
  tierBase: TTierBase
  children: ReactNode
}

const TierWrapper = ({ tierBase, children }: ITierWrapperProps) => {
  switch (tierBase) {
    case 'S+':
      return (
        <SPlusTierBeam borderRadius={BORDER_RADIUS}>{children}</SPlusTierBeam>
      )
    case 'S':
      return <STierBeam borderRadius={BORDER_RADIUS}>{children}</STierBeam>
    case 'A':
      return <ATierGlow borderRadius={BORDER_RADIUS}>{children}</ATierGlow>
    default:
      return <>{children}</>
  }
}

// =============================================================================
// Component
// =============================================================================

const CounterPickCardComponent = ({
  championId,
  championName,
  tier,
  onPress,
}: ICounterPickCardProps) => {
  const iconSource = getChampionIcon(championId)
  const tierColor = TIER_COLORS[tier]
  const tierBase = getTierBase(tier)
  const isHighTier = tierBase === 'S' || tier === 'S+'
  const hasEffect = tierBase === 'S+' || tierBase === 'S' || tierBase === 'A'

  const cardContent = (
    <View
      className={cn(
        'items-center px-5 py-3',
        !hasEffect && 'rounded-xl border border-white/10 bg-[#191a22]'
      )}
    >
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

      <Text className="text-center text-xs text-white/70" numberOfLines={1}>
        {championName}
      </Text>
    </View>
  )

  return (
    <Pressable onPress={onPress} className="items-center">
      {hasEffect ? (
        <TierWrapper tierBase={tierBase}>{cardContent}</TierWrapper>
      ) : (
        cardContent
      )}
    </Pressable>
  )
}

export const CounterPickCard = memo(CounterPickCardComponent, (prev, next) => {
  return (
    prev.championId === next.championId &&
    prev.championName === next.championName &&
    prev.tier === next.tier
  )
})
