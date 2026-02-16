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

import { CARD_BACKGROUND_COLOR, DEFAULT_WHEEL_COLORS } from './constants'

type BaseColorWheelProps = {
  width?: number
  height?: number
  size?: number
  colors?: readonly string[]
  rotation?: number
  innerRadius?: number
}

type SkiaColorWheelProps = BaseColorWheelProps & {
  centerColor?: string
  positions?: readonly number[]
}

export const SkiaColorWheel = ({
  width,
  height,
  size = 300,
  colors = DEFAULT_WHEEL_COLORS,
  rotation = -90,
  innerRadius = 0,
  centerColor = 'transparent',
  positions,
}: SkiaColorWheelProps) => {
  const actualWidth = width ?? size
  const actualHeight = height ?? size
  const centerX = actualWidth / 2
  const centerY = actualHeight / 2
  const radius = Math.max(actualWidth, actualHeight) / 2

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
              colors={[...colors]}
              positions={positions ? [...positions] : undefined}
            />
          </SkiaCircle>
          {innerRadius > 0 && (
            <SkiaCircle
              cx={centerX}
              cy={centerY}
              r={radius * innerRadius}
              color={centerColor !== 'transparent' ? centerColor : CARD_BACKGROUND_COLOR}
            />
          )}
        </Group>
      </Canvas>
    </View>
  )
}

type SkiaColorWheelBlurredProps = BaseColorWheelProps & {
  blurRadius?: number
  opacity?: number
  positions?: readonly number[]
}

export const SkiaColorWheelBlurred = ({
  width,
  height,
  size = 300,
  colors = DEFAULT_WHEEL_COLORS,
  rotation = -90,
  innerRadius = 0,
  blurRadius = 20,
  opacity = 0.6,
  positions,
}: SkiaColorWheelBlurredProps) => {
  const actualWidth = width ?? size
  const actualHeight = height ?? size
  const blurPadding = blurRadius * 2
  const canvasWidth = actualWidth + blurPadding * 2
  const canvasHeight = actualHeight + blurPadding * 2
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const radius = Math.max(actualWidth, actualHeight) / 2

  const transform = useMemo(
    () => [{ rotate: (rotation * Math.PI) / 180 }],
    [rotation]
  )

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
              colors={[...colors]}
              positions={positions ? [...positions] : undefined}
            />
          </SkiaCircle>
          {innerRadius > 0 && (
            <SkiaCircle
              cx={centerX}
              cy={centerY}
              r={radius * innerRadius}
              color={CARD_BACKGROUND_COLOR}
            />
          )}
        </Group>
      </Group>
    </Canvas>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
