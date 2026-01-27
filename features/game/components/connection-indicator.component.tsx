import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { colors } from '@/lib/colors'

type TConnectionStatus = 'connected' | 'reconnecting' | 'disconnected'
type TIndicatorSize = 'sm' | 'md' | 'lg'

interface IConnectionIndicatorProps {
  status: TConnectionStatus
  size?: TIndicatorSize
  animate?: boolean
}

const SIZE_CONFIG: Record<TIndicatorSize, { dot: number; glow: number }> = {
  sm: { dot: 8, glow: 10 },
  md: { dot: 10, glow: 12 },
  lg: { dot: 12, glow: 16 },
}

const STATUS_COLORS: Record<TConnectionStatus, string> = {
  connected: colors.success,
  reconnecting: colors.warning,
  disconnected: colors.danger,
}

export const ConnectionIndicator = ({
  status,
  size = 'md',
  animate = true,
}: IConnectionIndicatorProps) => {
  const scale = useSharedValue(1)
  const glowOpacity = useSharedValue(0.4)

  const sizeConfig = SIZE_CONFIG[size]
  const statusColor = STATUS_COLORS[status]
  const shouldAnimate = animate && status !== 'disconnected'

  useEffect(() => {
    if (shouldAnimate) {
      const duration = status === 'reconnecting' ? 600 : 1000

      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    } else {
      scale.value = withTiming(1, { duration: 200 })
      glowOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [shouldAnimate, status, scale, glowOpacity])

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glowOpacity.value,
  }))

  return (
    <View
      className="items-center justify-center"
      style={{ width: sizeConfig.glow + 8, height: sizeConfig.glow + 8 }}
    >
      {shouldAnimate && (
        <Animated.View
          style={[
            glowStyle,
            {
              position: 'absolute',
              width: sizeConfig.glow,
              height: sizeConfig.glow,
              borderRadius: sizeConfig.glow / 2,
              backgroundColor: statusColor,
              shadowColor: statusColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        />
      )}
      <View
        style={{
          width: sizeConfig.dot,
          height: sizeConfig.dot,
          borderRadius: sizeConfig.dot / 2,
          backgroundColor: statusColor,
        }}
      />
    </View>
  )
}
