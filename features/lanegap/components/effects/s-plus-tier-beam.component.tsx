import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { SkiaColorWheel, SkiaColorWheelBlurred } from './color-wheels.component'

/**
 * S+ Tier Dual Iridescent Beam Effect
 *
 * Two iridescent beams rotating in opposite directions.
 */

const SCALE_FACTOR = 2

// Beam colors: transparent -> iridescent trail -> transparent (11 colors)
const S_PLUS_BEAM_COLORS = [
  'transparent',
  'transparent',
  'transparent', // Pure white
  'transparent', // Light blue
  '#FFB8D8', // Pink
  '#FFFFFF', // Pure white
  '#B8FFE8', // Mint
  '#FFE0B8', // Peach
  'transparent', // Lavender
  'transparent', // Pure white
  'transparent',
]

// Positions for 11 colors
const S_PLUS_BEAM_POSITIONS = [
  0, 0.4, 0.5, 0.58, 0.66, 0.74, 0.82, 0.88, 0.92, 0.96, 1,
]

interface ISPlusTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const SPlusTierBeam = ({
  children,
  borderRadius = 12,
}: ISPlusTierBeamProps) => {
  const rotateClockwise = useSharedValue(0)
  const rotateCounterClockwise = useSharedValue(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const borderWidth = 2

  useEffect(() => {
    // Clockwise beam
    rotateClockwise.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    )
    // Counter-clockwise beam
    rotateCounterClockwise.value = withRepeat(
      withTiming(-360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    )
  }, [rotateClockwise, rotateCounterClockwise])

  const clockwiseStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateClockwise.value}deg` }],
  }))

  const counterClockwiseStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateCounterClockwise.value}deg` }],
  }))

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
    }
  }

  const { width, height } = dimensions
  const wheelSize = Math.max(width, height) * SCALE_FACTOR
  const glowSize = Math.max(width, height) * SCALE_FACTOR * 0.7

  return (
    <View style={styles.wrapper}>
      {/* Glow layer */}
      {width > 0 && height > 0 && (
        <View style={styles.glowWrapper} pointerEvents="none">
          <Animated.View style={clockwiseStyle}>
            <SkiaColorWheelBlurred
              width={glowSize}
              height={glowSize}
              colors={S_PLUS_BEAM_COLORS}
              positions={S_PLUS_BEAM_POSITIONS}
              blurRadius={10}
              opacity={0.6}
            />
          </Animated.View>
        </View>
      )}

      {/* Container for dual beams + content */}
      <View
        style={[styles.effectContainer, { borderRadius }]}
        onLayout={handleLayout}
      >
        {/* Clockwise beam */}
        <View style={[styles.borderLayer, { borderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, clockwiseStyle]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={S_PLUS_BEAM_COLORS}
              positions={S_PLUS_BEAM_POSITIONS}
            />
          </Animated.View>
        </View>

        {/* Counter-clockwise beam */}
        <View style={[styles.borderLayer, { borderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, counterClockwiseStyle]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={S_PLUS_BEAM_COLORS}
              positions={S_PLUS_BEAM_POSITIONS}
            />
          </Animated.View>
        </View>

        {/* Inner content */}
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
