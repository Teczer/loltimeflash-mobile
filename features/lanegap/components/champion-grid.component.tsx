import { memo, useCallback } from 'react'
import { FlatList, Keyboard, Text, View } from 'react-native'

import type { IChampion } from '@/assets/champions'

import { NUM_COLUMNS } from '../constants'
import { ChampionItem } from './champion-item.component'

interface IChampionGridProps {
  champions: IChampion[]
  onChampionPress: (champion: IChampion) => void
}

const ChampionGridComponent = ({ champions, onChampionPress }: IChampionGridProps) => {
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
          <Text className="font-sans text-muted-foreground">No champions found</Text>
        </View>
      }
    />
  )
}

export const ChampionGrid = memo(ChampionGridComponent)
