import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { styles } from './a-tier-glow.styles'
import { DEFAULT_BORDER_RADIUS, DEFAULT_BORDER_WIDTH, TIER_CONFIGS } from './constants'

interface IAPlusTierGlowProps {
  children: ReactNode
  borderRadius?: number
  borderWidth?: number
}

export const APlusTierGlow = ({
  children,
  borderRadius = DEFAULT_BORDER_RADIUS,
  borderWidth = DEFAULT_BORDER_WIDTH,
}: IAPlusTierGlowProps) => {
  const progress = useSharedValue(0)
  const config = TIER_CONFIGS.A_PLUS

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: config.duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [progress, config.duration])

  const glowStyle = useAnimatedStyle(() => {
    const spread = interpolate(progress.value, [0, 1], [...config.pulseSpread])
    const blur = interpolate(progress.value, [0, 1], [...config.pulseBlur])

    return {
      boxShadow: [
        {
          offsetX: 0,
          offsetY: 0,
          blurRadius: blur,
          spreadRadius: spread,
          color: `${config.color}90`,
        },
      ],
    }
  })

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.glow,
          { borderRadius, backgroundColor: `${config.color}00` },
          glowStyle,
        ]}
      />
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
