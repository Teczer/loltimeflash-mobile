import { Ionicons } from '@expo/vector-icons'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import * as Haptics from 'expo-haptics'
import { memo } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

import { ConnectionIndicator } from './connection-indicator.component'
import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

type TConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

interface IRoomCodeCopyButtonProps {
  roomId: string
  connectionStatus: TConnectionStatus
  copied: boolean
  onPress: () => void
}

const fallbackStyles = {
  normal: 'border-white/10 bg-white/5',
  pressed: 'border-white/20 bg-white/10',
}

export const RoomCodeCopyButton = memo((props: IRoomCodeCopyButtonProps) => {
  const { roomId, connectionStatus, copied, onPress } = props

  const canUseGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress()
  }

  const content = (
    <>
      <View className="flex-row items-center gap-1">
        <ConnectionIndicator status={connectionStatus} size="sm" />
        <Text className="font-mono text-sm tracking-wider text-white/80">
          {roomId}
        </Text>
      </View>
      <View className="h-4 w-px bg-white/20" />
      <Ionicons
        name={copied ? 'checkmark' : 'copy-outline'}
        size={16}
        color={copied ? colors.success : colors.mutedForeground}
      />
    </>
  )

  const containerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  }

  if (canUseGlass) {
    return (
      <Pressable onPress={handlePress}>
        <GlassView
          style={[containerStyle, { borderColor: 'rgba(255,255,255,0.1)' }]}
          glassEffectStyle="regular"
          isInteractive
        >
          {content}
        </GlassView>
      </Pressable>
    )
  }

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <View
          className={cn(
            'flex-row items-center gap-2 rounded-xl border px-4 py-2',
            pressed ? fallbackStyles.pressed : fallbackStyles.normal
          )}
        >
          {content}
        </View>
      )}
    </Pressable>
  )
})

RoomCodeCopyButton.displayName = 'RoomCodeCopyButton'
