import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { SkiaColorWheel, SkiaColorWheelBlurred } from './color-wheels.component'
import { DEFAULT_BORDER_RADIUS, SCALE_FACTOR } from './constants'
import { styles } from './glowing-border-card.styles'
import { compensateCorners } from './utils'

type GlowingBorderCardProps = {
  children: ReactNode
  colors: readonly string[]
  positions?: readonly number[]
  duration?: number
  showGlow?: boolean
  glowIntensity?: number
  glowSpread?: number
  glowBlurRadius?: number
  borderWidth?: number
  borderRadius?: number
  autoStart?: boolean
}

export const GlowingBorderCard = ({
  children,
  colors,
  positions,
  duration = 2000,
  borderWidth = 3,
  showGlow = true,
  glowIntensity = 0.8,
  glowSpread = 1.5,
  glowBlurRadius = 30,
  borderRadius = DEFAULT_BORDER_RADIUS,
  autoStart = true,
}: GlowingBorderCardProps) => {
  const progress = useSharedValue(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (autoStart) {
      progress.value = withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false
      )
    }
  }, [autoStart, duration, progress])

  const compensatedRotation = useDerivedValue(() => {
    return compensateCorners(progress.value)
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${compensatedRotation.value}deg` }],
  }))

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
    }
  }

  const { width, height } = dimensions
  const glowWidth = width * SCALE_FACTOR * glowSpread
  const glowHeight = height * SCALE_FACTOR * glowSpread
  const wheelSize = Math.max(width, height) * SCALE_FACTOR

  return (
    <View style={styles.wrapper}>
      {showGlow && width > 0 && height > 0 && (
        <View style={styles.glowWrapper} pointerEvents="none">
          <Animated.View style={animatedStyle}>
            <SkiaColorWheelBlurred
              width={glowWidth}
              height={glowHeight}
              colors={colors}
              positions={positions}
              blurRadius={glowBlurRadius}
              opacity={glowIntensity}
            />
          </Animated.View>
        </View>
      )}

      <View
        style={[styles.effectContainer, { borderRadius }]}
        onLayout={handleLayout}
      >
        <View style={[styles.borderLayer, { borderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, animatedStyle]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={colors}
              positions={positions}
            />
          </Animated.View>
        </View>

        <View
          style={[
            styles.innerContent,
            {
              margin: borderWidth,
              borderRadius: borderRadius - borderWidth,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
