/**
 * GlowingBorderCard - Copied from quattro4maggi LiveBorderCard
 *
 * A card with an animated glowing border effect using Skia color wheels.
 */

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { SkiaColorWheel, SkiaColorWheelBlurred } from './color-wheels.component'

const SCALE_FACTOR = 2

// Compensate for corner speed-up on rectangular shapes
// Slows down at corners (45°, 135°, 225°, 315°) and speeds up on flat edges
const compensateCorners = (angle: number, strength: number = 0.15): number => {
  'worklet'
  const rad = (angle * Math.PI) / 180
  // Sin wave with 4 peaks at the corners
  const correction = Math.sin(4 * rad) * strength * 15
  return angle - correction
}

type GlowingBorderCardProps = {
  children: ReactNode
  colors: string[]
  /** Custom positions for gradient colors (0-1 range) */
  positions?: number[]
  duration?: number
  /** Whether to show the glow effect */
  showGlow?: boolean
  /** Intensity of the glow (0-1), controls opacity */
  glowIntensity?: number
  /** How much the glow extends beyond the card (1 = same size, 1.5 = 50% larger) */
  glowSpread?: number
  /** Blur radius for the glow effect */
  glowBlurRadius?: number
  /** Border width in pixels */
  borderWidth?: number
  /** Border radius for the card */
  borderRadius?: number
  /** Whether to auto-start the animation */
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
  borderRadius = 12,
  autoStart = true,
}: GlowingBorderCardProps) => {
  const progress = useSharedValue(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const outerBorderRadius = borderRadius

  useEffect(() => {
    if (autoStart) {
      progress.value = withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false
      )
    }
  }, [autoStart, duration, progress])

  // Apply corner compensation for smoother rotation on rectangles
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

  // Calculate glow dimensions
  const { width, height } = dimensions
  const glowWidth = width * SCALE_FACTOR * glowSpread
  const glowHeight = height * SCALE_FACTOR * glowSpread
  const wheelSize = Math.max(width, height) * SCALE_FACTOR

  return (
    <View style={styles.wrapper}>
      {/* Glow layer - rendered behind everything, outside the clipped container */}
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

      {/* Container for border + content */}
      <View
        style={[styles.effectContainer, { borderRadius: outerBorderRadius }]}
        onLayout={handleLayout}
      >
        {/* Rotating color wheel border */}
        <View style={[styles.borderLayer, { borderRadius: outerBorderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, animatedStyle]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={colors}
              positions={positions}
            />
          </Animated.View>
        </View>

        {/* Inner content with background */}
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

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  effectContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  borderLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rotatingWheel: {
    position: 'absolute',
  },
  innerContent: {
    backgroundColor: '#191a22',
    zIndex: 2,
  },
})
