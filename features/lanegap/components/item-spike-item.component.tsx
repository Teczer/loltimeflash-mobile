import { Image, Text, View } from 'react-native'

import { getItemIcon } from '@/assets/items'

import type { IItemSpike } from '../types'

interface IItemSpikeItemProps {
  spike: IItemSpike
}

export const ItemSpikeItem = ({ spike }: IItemSpikeItemProps) => {
  const itemIcon = getItemIcon(spike.itemId)

  return (
    <View className="flex-row items-center gap-3 rounded-lg bg-white/5 p-3">
      <View className="size-10 overflow-hidden rounded-lg border border-white/10">
        {itemIcon && (
          <Image source={itemIcon} className="size-full" resizeMode="cover" />
        )}
      </View>

      <Text className="flex-1 text-sm leading-relaxed text-white/70">
        {spike.text}
      </Text>
    </View>
  )
}
