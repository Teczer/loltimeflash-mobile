import { memo, useCallback } from 'react'
import { FlatList, Keyboard, Text, View } from 'react-native'

import type { IChampion } from '@/assets/champions'

import { ChampionItem } from '@/features/lanegap/components/champion/champion-item.component'
import { NUM_COLUMNS } from '@/features/lanegap/constants'

interface IChampionGridProps {
  champions: IChampion[]
  onChampionPress: (champion: IChampion) => void
}

const ChampionGridComponent = ({
  champions,
  onChampionPress,
}: IChampionGridProps) => {
  const renderItem = useCallback(
    ({ item }: { item: IChampion }) => (
      <ChampionItem champion={item} onPress={() => onChampionPress(item)} />
    ),
    [onChampionPress]
  )

  const keyExtractor = useCallback((item: IChampion) => item.name, [])

  return (
    <FlatList
      data={champions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      contentContainerClassName="px-3 pb-24"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      maxToRenderPerBatch={20}
      windowSize={5}
      initialNumToRender={20}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onScrollBeginDrag={Keyboard.dismiss}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-muted-foreground font-sans">
            No champions found
          </Text>
        </View>
      }
    />
  )
}

export const ChampionGrid = memo(ChampionGridComponent)
