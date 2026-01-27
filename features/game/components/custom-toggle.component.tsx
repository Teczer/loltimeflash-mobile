import { Pressable } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

import { colors } from '@/lib/colors'

interface ICustomToggleProps {
  value: boolean
  onValueChange: () => void
}

export const CustomToggle = ({ value, onValueChange }: ICustomToggleProps) => {
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(value ? 20 : 0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        }),
      },
    ],
  }))

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      value ? colors.gold : 'rgba(255,255,255,0.1)',
      { duration: 200 }
    ),
    borderColor: withTiming(
      value ? colors.gold : 'rgba(255,255,255,0.2)',
      { duration: 200 }
    ),
  }))

  return (
    <Pressable onPress={onValueChange}>
      <Animated.View
        style={trackStyle}
        className="h-7 w-12 justify-center rounded-full border px-0.5"
      >
        <Animated.View
          style={thumbStyle}
          className="size-5 rounded-full bg-white shadow-lg"
        />
      </Animated.View>
    </Pressable>
  )
}
