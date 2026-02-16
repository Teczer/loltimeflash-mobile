import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback } from 'react'
import { FlatList, Text, View } from 'react-native'

import type { IChampion } from '@/assets/champions'
import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

import { ICON_SIZES } from '@/features/lanegap/constants'
import { ChampionItem } from '@/features/lanegap/components/champion/champion-item.component'

type TSectionType = 'favorites' | 'recent' | 'enemies'

const SECTION_CONFIG: Record<
  TSectionType,
  { icon: string; color: string; label: string }
> = {
  favorites: { icon: 'star', color: colors.gold, label: 'Favorites' },
  recent: {
    icon: 'time-outline',
    color: colors.mutedForeground,
    label: 'Recent',
  },
  enemies: { icon: 'skull', color: '#ef4444', label: 'Enemy Champions' },
}

interface IChampionSectionProps {
  type: TSectionType
  champions: IChampion[]
  onChampionPress: (champion: IChampion) => void
  horizontal?: boolean
}

const ChampionSectionComponent = ({
  type,
  champions,
  onChampionPress,
  horizontal = false,
}: IChampionSectionProps) => {
  const config = SECTION_CONFIG[type]

  const renderItem = useCallback(
    ({ item }: { item: IChampion }) => (
      <ChampionItem champion={item} onPress={() => onChampionPress(item)} />
    ),
    [onChampionPress]
  )

  const keyExtractor = useCallback(
    (item: IChampion) => `${type}-${item.name}`,
    [type]
  )

  if (champions.length === 0) return null

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Ionicons name={config.icon as any} size={ICON_SIZES.xs} color={config.color} />
        <Text className="font-sans-bold text-foreground/80 text-sm">
          {config.label}
        </Text>
      </View>
      <View className={cn(horizontal && '-mx-4')}>
        <FlatList
          data={champions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={horizontal}
          contentContainerClassName={cn(horizontal && 'px-4')}
        />
      </View>
    </View>
  )
}

export const ChampionSection = memo(ChampionSectionComponent)
