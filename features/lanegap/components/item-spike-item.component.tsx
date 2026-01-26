import { memo } from 'react'
import { Image, Text, View } from 'react-native'

import config from '@/lib/config'

import type { IItemSpike } from '../types'

interface IItemSpikeItemProps {
  spike: IItemSpike
}

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com'

/**
 * Item spike item matching web's ItemSpikeList
 * Web: flex items-center gap-3 rounded-lg bg-white/5 p-3
 * Icon: h-10 w-10 rounded-lg ring-1 ring-white/10
 */
const ItemSpikeItemComponent = ({ spike }: IItemSpikeItemProps) => {
  const itemIconUrl = `${DDRAGON_BASE}/cdn/${config.patchVersion}/img/item/${spike.itemId}.png`

  return (
    <View className="flex-row items-center gap-3 rounded-lg bg-white/5 p-3">
      {/* Item Icon */}
      <View className="size-10 overflow-hidden rounded-lg border border-white/10">
        <Image
          source={{ uri: itemIconUrl }}
          className="size-full"
          resizeMode="cover"
        />
      </View>

      {/* Description */}
      <Text className="flex-1 text-sm leading-relaxed text-white/70">
        {spike.text}
      </Text>
    </View>
  )
}

export const ItemSpikeItem = memo(ItemSpikeItemComponent)
