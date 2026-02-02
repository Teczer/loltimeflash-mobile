import { memo, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import { getChampionIcon, type IChampion } from '@/assets/champions'
import { cn } from '@/lib/utils'

import { useLaneGapLayout } from '@/features/lanegap/hooks'

interface IChampionItemProps {
  champion: IChampion
  onPress: () => void
}

const ChampionItemComponent = ({ champion, onPress }: IChampionItemProps) => {
  const [isPressed, setIsPressed] = useState(false)
  const { itemSize, iconSize } = useLaneGapLayout()
  const iconSource = getChampionIcon(champion.name) || champion.skins[0]?.source

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={cn(
        'm-1.5 items-center rounded-xl border p-2',
        isPressed
          ? 'border-white/20 bg-white/10'
          : 'border-transparent bg-white/5'
      )}
      style={{ width: itemSize }}
    >
      <View className="overflow-hidden rounded-lg">
        <Image
          source={iconSource}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="cover"
        />
      </View>
      <Text
        className={cn(
          'mt-1.5 text-center text-[10px] font-medium',
          isPressed ? 'text-white' : 'text-white/60'
        )}
        numberOfLines={1}
      >
        {champion.name}
      </Text>
    </Pressable>
  )
}

export const ChampionItem = memo(ChampionItemComponent)
