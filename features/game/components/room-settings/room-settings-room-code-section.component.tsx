import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Text, View } from 'react-native'

import { ConnectionIndicator } from '../connection-indicator.component'
import { SettingsCard } from '../settings-card.component'
import { SettingsSection } from '../settings-section.component'
import { colors } from '@/lib/colors'

interface IRoomSettingsRoomCodeSectionProps {
  roomId: string
  title: string
  isConnected: boolean
  copied: boolean
  connectedLabel: string
  disconnectedLabel: string
  copyLabel: string
  copiedLabel: string
  onCopy: () => void
}

export const RoomSettingsRoomCodeSection = memo(
  (props: IRoomSettingsRoomCodeSectionProps) => {
    const {
      roomId,
      title,
      isConnected,
      copied,
      connectedLabel,
      disconnectedLabel,
      copyLabel,
      copiedLabel,
      onCopy,
    } = props

    const connectionStatus = isConnected ? 'connected' : 'disconnected'

    return (
      <SettingsSection icon="key" iconColor={colors.goldLight} title={title}>
        <SettingsCard
          leftElement={
            <ConnectionIndicator status={connectionStatus} size="lg" />
          }
          title={roomId}
          subtitle={isConnected ? connectedLabel : disconnectedLabel}
          onPress={onCopy}
          rightElement={
            <View className="flex-row items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={16}
                color={copied ? colors.success : colors.foreground}
              />
              <Text
                className={`font-sans text-sm ${copied ? 'text-success' : 'text-foreground'}`}
              >
                {copied ? copiedLabel : copyLabel}
              </Text>
            </View>
          }
        />
      </SettingsSection>
    )
  }
)
