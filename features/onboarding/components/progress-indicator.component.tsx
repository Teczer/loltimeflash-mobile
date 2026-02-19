import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect } from 'react'
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native'
import {
  Gesture,
  GestureDetector,
  type PanGesture,
} from 'react-native-gesture-handler'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { colors } from '@/lib/colors'

interface IPaginationProps extends ViewProps {
  activeIndex: number
  totalItems: number
  dotSize?: number
  inactiveColor?: string
  activeColor?: string
  currentColor?: string
  borderRadius?: number
  dotContainer?: number
  onIndexChange?: (index: number) => void
  containerStyle?: ViewStyle
}

const DEFAULT_DOT_SIZE = 10
const DEFAULT_BORDER_RADIUS = 100
const DEFAULT_DOT_CONTAINER = 24

function Indicator({
  animation,
  dotContainer,
  radius,
  containerStyle,
}: {
  animation: SharedValue<number>
  dotContainer: number
  radius: number
  containerStyle?: ViewStyle
}) {
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const width = dotContainer + dotContainer * animation.value
    const opacity = interpolate(
      animation.value,
      [0, 0.01],
      [0, 1],
      Extrapolation.CLAMP
    )
    return {
      width,
      opacity: withTiming(opacity, {
        duration: 200,
        easing: Easing.linear,
      }),
    }
  })

  return (
    <Animated.View
      style={[
        {
          height: dotContainer,
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: radius,
        },
        containerStyle,
        indicatorAnimatedStyle,
      ]}
    />
  )
}

function Dot({
  index,
  animation,
  inactiveColor,
  activeColor,
  currentColor,
  dotSize,
  borderRadius,
}: {
  index: number
  animation: SharedValue<number>
  inactiveColor: string
  activeColor: string
  currentColor: string
  dotSize: number
  borderRadius: number
}) {
  const animatedDotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animation.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, currentColor]
    ),
  }))

  return (
    <View style={styles.dotContainer}>
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius,
          },
          animatedDotStyle,
        ]}
      />
    </View>
  )
}

function PaginationComponent(props: IPaginationProps) {
  const {
    activeIndex,
    totalItems,
    dotSize = DEFAULT_DOT_SIZE,
    inactiveColor = colors.input,
    activeColor = colors.goldLight,
    currentColor = colors.gold,
    borderRadius = DEFAULT_BORDER_RADIUS,
    dotContainer = DEFAULT_DOT_CONTAINER,
    onIndexChange,
    containerStyle,
    ...rest
  } = props

  const clampedActiveIndex = Math.min(Math.max(activeIndex, 0), totalItems - 1)
  const scale = useSharedValue(1)
  const index_ = useSharedValue(clampedActiveIndex)

  useEffect(() => {
    index_.value = Math.min(Math.max(activeIndex, 0), totalItems - 1)
    if (onIndexChange) {
      onIndexChange(index_.value)
    }
  }, [activeIndex, totalItems, index_, onIndexChange])

  const longPressGesture: PanGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withTiming(1.2, { duration: 150 })
    })
    .onUpdate((e) => {
      const totalWidth = dotContainer * totalItems
      const startX = e.absoluteX - e.x
      const relativeX = e.absoluteX - startX
      const idx = Math.floor(relativeX / (totalWidth / totalItems))
      if (idx >= 0 && idx < totalItems) {
        if (index_.value !== idx) {
          scheduleOnRN(impactAsync, ImpactFeedbackStyle.Medium)
        }
        index_.value = idx
        if (onIndexChange) {
          scheduleOnRN(onIndexChange, idx)
        }
      }
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 150 })
    })
    .onFinalize(() => {
      scale.value = withTiming(1, { duration: 150 })
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const animation = useDerivedValue(() =>
    withTiming(index_.value, {
      easing: Easing.linear,
      duration: 300,
    })
  )

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={animatedStyle} {...rest}>
        <View style={styles.row}>
          <Indicator
            animation={animation}
            dotContainer={dotContainer}
            radius={borderRadius}
            containerStyle={containerStyle}
          />
          {Array.from({ length: totalItems }).map((_, i) => (
            <Dot
              key={i}
              index={i}
              animation={animation}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              currentColor={currentColor}
              dotSize={dotSize}
              borderRadius={borderRadius}
            />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  )
}

export const Pagination = React.memo(PaginationComponent)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  dotContainer: {
    width: DEFAULT_DOT_CONTAINER,
    height: DEFAULT_DOT_CONTAINER,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
