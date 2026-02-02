import { memo } from 'react'
import { View } from 'react-native'

import { ZileanRewindIcon, ZileanSpeedUpIcon } from '@/assets/game'

import { TimerControlButton } from './timer-control-button.component'

interface ITimerControlsProps {
  isOnCooldown: boolean
  onAdjust: (seconds: number) => void
}

// text-red-400
const MINUS_GLOW_COLOR = 'rgba(248,113,113,1)'
// text-blue-400
const PLUS_GLOW_COLOR = 'rgba(96,165,250,1)'

const TimerControlsComponent = (props: ITimerControlsProps) => {
  const { isOnCooldown, onAdjust } = props

  if (!isOnCooldown) {
    return null
  }

  return (
    <View className="flex-row items-center gap-4 text-red-400">
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
    </View>
  )
}

export const TimerControls = memo(TimerControlsComponent, (prev, next) => {
  return prev.isOnCooldown === next.isOnCooldown
})
