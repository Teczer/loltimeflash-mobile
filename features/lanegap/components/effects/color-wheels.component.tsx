/**
 * ColorWheels - Copied from quattro4maggi
 *
 * Skia implementation of a customizable color wheel with smooth gradient transitions.
 */

import {
  Blur,
  Canvas,
  Group,
  Paint,
  Circle as SkiaCircle,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

// ============================================================================
// SHARED TYPES & CONSTANTS
// ============================================================================

const DEFAULT_COLORS = [
  '#FFEB3B', // Yellow
  '#FF9800', // Orange
  '#F44336', // Red
  '#E91E63', // Magenta
  '#9C27B0', // Purple
  '#3F51B5', // Indigo
  '#03A9F4', // Light Blue
  '#4CAF50', // Green
]

type BaseColorWheelProps = {
  /** Width of the color wheel. If only size is provided, uses size for both dimensions */
  width?: number
  /** Height of the color wheel. If only size is provided, uses size for both dimensions */
  height?: number
  /** @deprecated Use width/height instead. Sets both width and height when provided alone */
  size?: number
  /** Array of colors for each segment */
  colors?: string[]
  /** Starting rotation in degrees (-90 starts from top) */
  rotation?: number
  /** Inner radius as percentage (0-1) for donut effect, 0 = full pie */
  innerRadius?: number
}

// ============================================================================
// SKIA IMPLEMENTATION WITH SWEEP GRADIENT
// ============================================================================

type SkiaColorWheelProps = BaseColorWheelProps & {
  /** Background color for the center (donut hole) */
  centerColor?: string
  /** Custom positions for gradient colors (0-1 range) */
  positions?: number[]
}

/**
 * SkiaColorWheel
 *
 * Color wheel implementation using react-native-skia with SweepGradient.
 * Colors smoothly blend into each other around the circle.
 * Best for: Animations, smooth color transitions, GPU acceleration.
 */
export const SkiaColorWheel = ({
  width,
  height,
  size = 300,
  colors = DEFAULT_COLORS,
  rotation = -90,
  innerRadius = 0,
  centerColor = 'transparent',
  positions,
}: SkiaColorWheelProps) => {
  // Support both width/height and legacy size prop
  const actualWidth = width ?? size
  const actualHeight = height ?? size

  const centerX = actualWidth / 2
  const centerY = actualHeight / 2
  const radius = Math.max(actualWidth, actualHeight) / 2

  // Create rotation transform
  const transform = useMemo(
    () => [{ rotate: (rotation * Math.PI) / 180 }],
    [rotation]
  )

  return (
    <View style={styles.container}>
      <Canvas style={{ width: actualWidth, height: actualHeight }}>
        <Group transform={transform} origin={vec(centerX, centerY)}>
          <SkiaCircle cx={centerX} cy={centerY} r={radius}>
            <SweepGradient
              c={vec(centerX, centerY)}
              colors={colors}
              positions={positions}
            />
          </SkiaCircle>

          {/* Inner circle for donut hole */}
          {innerRadius > 0 && (
            <SkiaCircle
              cx={centerX}
              cy={centerY}
              r={radius * innerRadius}
              color={centerColor !== 'transparent' ? centerColor : '#191a22'}
            />
          )}
        </Group>
      </Canvas>
    </View>
  )
}

// ============================================================================
// SKIA BLURRED IMPLEMENTATION (FOR GLOW EFFECT)
// ============================================================================

type SkiaColorWheelBlurredProps = BaseColorWheelProps & {
  /** Blur radius for the glow effect */
  blurRadius?: number
  /** Opacity of the blurred wheel (0-1) */
  opacity?: number
  /** Custom positions for gradient colors (0-1 range) */
  positions?: number[]
}

/**
 * SkiaColorWheelBlurred
 *
 * A blurred version of the color wheel with smooth gradient for creating glow effects.
 * Uses SweepGradient for smooth color blending with Gaussian blur applied.
 *
 * Best for: Glow effects behind cards, ambient lighting effects.
 */
export const SkiaColorWheelBlurred = ({
  width,
  height,
  size = 300,
  colors = DEFAULT_COLORS,
  rotation = -90,
  innerRadius = 0,
  blurRadius = 20,
  opacity = 0.6,
  positions,
}: SkiaColorWheelBlurredProps) => {
  // Support both width/height and legacy size prop
  const actualWidth = width ?? size
  const actualHeight = height ?? size

  // Add padding to canvas to prevent blur clipping at edges
  const blurPadding = blurRadius * 2
  const canvasWidth = actualWidth + blurPadding * 2
  const canvasHeight = actualHeight + blurPadding * 2

  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const radius = Math.max(actualWidth, actualHeight) / 2

  // Create rotation transform
  const transform = useMemo(
    () => [{ rotate: (rotation * Math.PI) / 180 }],
    [rotation]
  )

  // Create the blur paint for the layer
  const blurPaint = (
    <Paint>
      <Blur blur={blurRadius} />
    </Paint>
  )

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
        opacity,
        marginLeft: -blurPadding / 2,
        marginTop: -blurPadding / 2,
      }}
    >
      <Group layer={blurPaint}>
        <Group transform={transform} origin={vec(centerX, centerY)}>
          <SkiaCircle cx={centerX} cy={centerY} r={radius}>
            <SweepGradient
              c={vec(centerX, centerY)}
              colors={colors}
              positions={positions}
            />
          </SkiaCircle>
          {/* Inner circle for donut hole */}
          {innerRadius > 0 && (
            <SkiaCircle
              cx={centerX}
              cy={centerY}
              r={radius * innerRadius}
              color="#191a22"
            />
          )}
        </Group>
      </Group>
    </Canvas>
  )
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
