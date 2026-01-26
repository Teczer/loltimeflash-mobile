import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import type { ISkinItemProps } from './types'

const SkinItemComponent = ({ skin, isSelected, onPress }: ISkinItemProps) => (
  <Pressable onPress={onPress} className="mx-1.5 w-24 items-center">
    <View className="bg-card h-16 w-full overflow-hidden rounded-lg">
      <Image
        source={skin.source}
        className="h-full w-full"
        resizeMode="cover"
      />
      {isSelected && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        </View>
      )}
    </View>
    <Text
      className="text-muted mt-1 w-full text-center font-sans text-xs"
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {skin.name}
    </Text>
  </Pressable>
)

export const SkinItem = memo(SkinItemComponent)
