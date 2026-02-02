import { memo } from 'react'
import { Image, Pressable, Text, View, type ViewStyle } from 'react-native'

import { cn } from '@/lib/utils'

interface ITimerControlButtonProps {
  icon: number
  label: string
  textColorClass: string
  glowColor: string
  onPress: () => void
}

const TimerControlButtonComponent = (props: ITimerControlButtonProps) => {
  const { icon, label, textColorClass, glowColor, onPress } = props

  const getGlowStyle = (pressed: boolean): ViewStyle => {
    if (!pressed) return {}

    return {
      boxShadow: [
        {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 16,
          spreadDistance: 1,
          color: glowColor,
        },
      ],
    }
  }

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center gap-1 rounded-lg p-2 active:scale-95"
    >
      {({ pressed }) => (
        <View
          className={cn(
            'items-center gap-1',
            pressed ? 'opacity-100' : 'opacity-60'
          )}
        >
          <View className="size-10 rounded-lg" style={getGlowStyle(pressed)}>
            <Image
              source={icon}
              className={cn('size-10 rounded-lg', !pressed && 'grayscale')}
              resizeMode="contain"
            />
          </View>
          <Text className={cn('font-sans-bold text-xs', textColorClass)}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

export const TimerControlButton = memo(TimerControlButtonComponent)
