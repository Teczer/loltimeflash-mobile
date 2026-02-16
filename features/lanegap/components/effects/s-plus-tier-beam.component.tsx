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
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_BORDER_WIDTH,
  SCALE_FACTOR,
  TIER_CONFIGS,
} from './constants'
import { styles } from './s-plus-tier-beam.styles'
import { compensateCorners } from './utils'

interface ISPlusTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const SPlusTierBeam = ({
  children,
  borderRadius = DEFAULT_BORDER_RADIUS,
}: ISPlusTierBeamProps) => {
  const progress = useSharedValue(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const config = TIER_CONFIGS.S_PLUS

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(360, { duration: config.duration, easing: Easing.linear }),
      -1,
      false
    )
  }, [progress, config.duration])

  const beam1Rotation = useDerivedValue(() => {
    return compensateCorners(progress.value)
  })

  const beam2Rotation = useDerivedValue(() => {
    return compensateCorners(progress.value + 180)
  })

  const beam1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${beam1Rotation.value}deg` }],
  }))

  const beam2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${beam2Rotation.value}deg` }],
  }))

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
    }
  }

  const { width, height } = dimensions
  const wheelSize = Math.max(width, height) * SCALE_FACTOR
  const glowSize = Math.max(width, height) * SCALE_FACTOR * config.glowSpread

  return (
    <View style={styles.wrapper}>
      {width > 0 && height > 0 && (
        <View style={styles.glowWrapper} pointerEvents="none">
          <Animated.View style={beam1Style}>
            <SkiaColorWheelBlurred
              width={glowSize}
              height={glowSize}
              colors={config.colors}
              positions={config.positions}
              blurRadius={config.glowBlurRadius}
              opacity={config.glowIntensity}
            />
          </Animated.View>
        </View>
      )}

      {width > 0 && height > 0 && (
        <View style={styles.glowWrapper} pointerEvents="none">
          <Animated.View style={beam2Style}>
            <SkiaColorWheelBlurred
              width={glowSize}
              height={glowSize}
              colors={config.colors}
              positions={config.positions}
              blurRadius={config.glowBlurRadius}
              opacity={config.glowIntensity}
            />
          </Animated.View>
        </View>
      )}

      <View
        style={[styles.effectContainer, { borderRadius }]}
        onLayout={handleLayout}
      >
        <View style={[styles.borderLayer, { borderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, beam1Style]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={config.colors}
              positions={config.positions}
            />
          </Animated.View>
        </View>

        <View style={[styles.borderLayer, { borderRadius }]}>
          <Animated.View style={[styles.rotatingWheel, beam2Style]}>
            <SkiaColorWheel
              width={wheelSize}
              height={wheelSize}
              colors={config.colors}
              positions={config.positions}
            />
          </Animated.View>
        </View>

        <View
          style={[
            styles.innerContent,
            {
              margin: DEFAULT_BORDER_WIDTH,
              borderRadius: borderRadius - DEFAULT_BORDER_WIDTH,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
