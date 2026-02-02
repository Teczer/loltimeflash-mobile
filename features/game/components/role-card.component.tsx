import { memo } from 'react'
import { Image, ImageSourcePropType, Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'

import { ITEM_ICONS } from '../constants/game.constants'
import { getRemainingTime } from '../hooks/use-flash-cooldown.hook'
import type { ILeagueRole, ISummonerData } from '../types/game.types'

import { FlashButton } from './flash-button.component'
import { TimerControls } from './timer-controls.component'

// Role icon mapping
const ROLE_ICONS: Record<string, ImageSourcePropType> = {
  toprole: require('@/assets/images/roles/toprole-icon.png'),
  junglerole: require('@/assets/images/roles/junglerole-icon.png'),
  midrole: require('@/assets/images/roles/midrole-icon.png'),
  adcrole: require('@/assets/images/roles/adcrole-icon.png'),
  supportrole: require('@/assets/images/roles/supportrole-icon.png'),
}

interface IRoleCardProps {
  role: ILeagueRole
  data: ISummonerData
  onFlashPress: () => void
  onToggleBoots: () => void
  onAdjustTimer?: (seconds: number) => void
}

const RoleCardComponent = (props: IRoleCardProps) => {
  const { role, data, onFlashPress, onToggleBoots, onAdjustTimer } = props

  const remainingSeconds = getRemainingTime(data.isFlashed)
  const isOnCooldown = remainingSeconds > 0

  // Get icon source - use champion icon if available, otherwise role icon
  const iconSource = data.champion?.championIconUrl
    ? { uri: data.champion.championIconUrl }
    : ROLE_ICONS[role.icon]

  return (
    <View className="items-center gap-y-4 py-2">
      {/* Flash Button with Lucidity Boots overlay */}
      <View className="relative">
        <FlashButton
          iconSource={iconSource}
          cooldown={data.isFlashed}
          onPress={onFlashPress}
        />

        {/* Lucidity Boots toggle - absolute positioned top-right */}
        <Pressable
          onPress={onToggleBoots}
          className="absolute -right-2 -top-2 z-10 rounded-lg bg-black/50 p-0.5 active:scale-95"
        >
          <Image
            source={ITEM_ICONS.lucidityBoots}
            className={cn(
              'size-10 rounded-md',
              !data.lucidityBoots && 'opacity-50'
            )}
            resizeMode="cover"
          />
        </Pressable>
      </View>

      {/* Timer Controls (+/-2s buttons) - always rendered for consistent layout */}
      {onAdjustTimer && (
        <TimerControls isOnCooldown={isOnCooldown} onAdjust={onAdjustTimer} />
      )}
    </View>
  )
}

export const RoleCard = memo(RoleCardComponent, (prev, next) => {
  return (
    prev.role.name === next.role.name &&
    prev.role.icon === next.role.icon &&
    prev.data.isFlashed === next.data.isFlashed &&
    prev.data.lucidityBoots === next.data.lucidityBoots &&
    prev.data.champion?.championIconUrl === next.data.champion?.championIconUrl
  )
})
