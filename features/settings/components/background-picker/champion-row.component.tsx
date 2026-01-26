import { memo, useCallback } from 'react'
import { FlatList, Text, View } from 'react-native'

import type { ISkin } from '@/assets/champions'

import { SkinItem } from './skin-item.component'
import type { IChampionRowProps } from './types'

const ChampionRowComponent = ({
  champion,
  selectedChampion,
  selectedSkinIndex,
  onSelectSkin,
}: IChampionRowProps) => {
  const renderSkin = useCallback(
    ({ item }: { item: ISkin }) => (
      <SkinItem
        skin={item}
        isSelected={
          selectedChampion === champion.name && selectedSkinIndex === item.index
        }
        onPress={() => onSelectSkin(champion.name, item.index)}
      />
    ),
    [champion.name, selectedChampion, selectedSkinIndex, onSelectSkin]
  )

  const keyExtractor = useCallback(
    (item: ISkin) => `${champion.name}-${item.index}`,
    [champion.name]
  )

  return (
    <View className="border-border border-b py-2">
      <Text className="font-sans-bold text-foreground mb-2 px-4 text-sm">
        {champion.name}
      </Text>
      <FlatList
        data={champion.skins}
        renderItem={renderSkin}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-3"
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={3}
      />
    </View>
  )
}

export const ChampionRow = memo(ChampionRowComponent)
