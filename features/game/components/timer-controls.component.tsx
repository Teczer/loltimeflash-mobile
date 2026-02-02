import { memo, useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { ZileanRewindIcon, ZileanSpeedUpIcon } from '@/assets/game'

import { TimerControlButton } from '@/features/game/components/timer-control-button.component'

interface ITimerControlsProps {
  isOnCooldown: boolean
  onAdjust: (seconds: number) => void
}

// text-red-400
const MINUS_GLOW_COLOR = 'rgba(248,113,113,1)'
// text-blue-400
const PLUS_GLOW_COLOR = 'rgba(96,165,250,1)'

// Fixed height for the controls container
const CONTROLS_HEIGHT = 48

const TimerControlsComponent = (props: ITimerControlsProps) => {
  const { isOnCooldown, onAdjust } = props

  const opacity = useSharedValue(isOnCooldown ? 1 : 0)

  useEffect(() => {
    opacity.value = withTiming(isOnCooldown ? 1 : 0, { duration: 200 })
  }, [isOnCooldown, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[{ height: CONTROLS_HEIGHT }, animatedStyle]}
      className="flex-row items-center justify-center gap-4"
      pointerEvents={isOnCooldown ? 'auto' : 'none'}
    >
      <TimerControlButton
        icon={ZileanRewindIcon}
        label="-2s"
        glowColor={MINUS_GLOW_COLOR}
        textColorClass="text-red-400"
        onPress={() => onAdjust(-2)}
      />

      <TimerControlButton
        icon={ZileanSpeedUpIcon}
        label="+2s"
        glowColor={PLUS_GLOW_COLOR}
        textColorClass="text-blue-400"
        onPress={() => onAdjust(2)}
      />
    </Animated.View>
  )
}

export const TimerControls = memo(TimerControlsComponent, (prev, next) => {
  return prev.isOnCooldown === next.isOnCooldown
})
