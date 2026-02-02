import { memo, useEffect, useState } from 'react'
import { Image, ImageSourcePropType, Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'

import { TitleText } from '@/components/ui'
import {
  formatCooldown,
  getRemainingTime,
} from '@/features/game/hooks/use-flash-cooldown.hook'

interface IFlashButtonProps {
  iconSource: ImageSourcePropType | { uri: string }
  cooldown: number | false
  onPress: () => void
}

const FlashButtonComponent = (props: IFlashButtonProps) => {
  const { iconSource, cooldown, onPress } = props

  const [, setTick] = useState(0)

  useEffect(() => {
    if (typeof cooldown === 'number') {
      const interval = setInterval(() => setTick((prev) => prev + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [cooldown])

  const remainingSeconds = getRemainingTime(cooldown)
  const isOnCooldown = remainingSeconds > 0
  const isUri = typeof iconSource === 'object' && 'uri' in iconSource

  return (
    <Pressable
      onPress={onPress}
      className="relative size-32 items-center justify-center overflow-hidden rounded-xl"
    >
      {({ pressed }) => (
        <View className={cn('size-full', pressed && 'opacity-80')}>
          {/* Timer overlay */}
          {isOnCooldown && (
            <View className="absolute inset-0 z-20 items-center justify-center">
              <TitleText size="lg">
                {formatCooldown(remainingSeconds)}
              </TitleText>
            </View>
          )}

          {/* Icon */}
          <Image
            source={
              isUri ? { uri: (iconSource as { uri: string }).uri } : iconSource
            }
            className={cn('size-full', isOnCooldown && 'opacity-40')}
            resizeMode="contain"
          />
        </View>
      )}
    </Pressable>
  )
}

export const FlashButton = memo(FlashButtonComponent, (prev, next) => {
  return prev.cooldown === next.cooldown && prev.iconSource === next.iconSource
})
