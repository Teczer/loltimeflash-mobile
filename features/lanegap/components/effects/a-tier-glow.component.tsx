import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const A_TIER_COLOR = '#F97316'
const BORDER_WIDTH = 1

interface IATierGlowProps {
  children: ReactNode
  borderRadius?: number
  borderWidth?: number
}

export const ATierGlow = ({
  children,
  borderRadius = 12,
  borderWidth = BORDER_WIDTH,
}: IATierGlowProps) => {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [progress])

  const glowStyle = useAnimatedStyle(() => {
    const spread = interpolate(progress.value, [0, 1], [0, 3])
    const blur = interpolate(progress.value, [0, 1], [2, 8])

    return {
      boxShadow: [
        {
          offsetX: 0,
          offsetY: 0,
          blurRadius: blur,
          spreadRadius: spread,
          color: `${A_TIER_COLOR}90`,
        },
      ],
    }
  })

  return (
    <View style={styles.wrapper}>
      {/* Pulsing shadow glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            borderRadius,
            backgroundColor: `${A_TIER_COLOR}00`, // Very subtle orange tint
          },
          glowStyle,
        ]}
      />
      {/* Content */}
      <View
        style={[
          styles.content,
          {
            borderRadius: borderRadius - borderWidth,
            margin: borderWidth,
          },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: '#191a22',
    overflow: 'hidden',
  },
})
