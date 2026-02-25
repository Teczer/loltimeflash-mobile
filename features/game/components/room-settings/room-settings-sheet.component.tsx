import { memo } from 'react'

import { BottomSheet } from '@/components/ui'

import { RoomSettingsFetchSection } from './room-settings-fetch-section.component'
import { RoomSettingsRoomCodeSection } from './room-settings-room-code-section.component'
import { RoomSettingsSoundSection } from './room-settings-sound-section.component'
import { RoomSettingsUsersSection } from './room-settings-users-section.component'
import type { ILiveGameData } from '@/features/game/types/riot.types'

interface IRoomSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  roomId: string
  users: string[]
  isConnected: boolean
  copied: boolean
  volume: 'on' | 'off'
  onCopyCode: () => void
  onGameDataFetched: (data: ILiveGameData) => void
  onVolumeChange: (value: boolean) => void
  fetchLiveGameLabel: string
  connectedUsersLabel: string
  noUsersConnectedLabel: string
  roomCodeLabel: string
  connectedLabel: string
  disconnectedLabel: string
  copyLabel: string
  copiedLabel: string
  soundLabel: string
  soundOnLabel: string
  soundOffLabel: string
  flashNotificationSoundLabel: string
}

export const RoomSettingsSheet = memo((props: IRoomSettingsSheetProps) => {
  const {
    isOpen,
    onClose,
    title,
    roomId,
    users,
    isConnected,
    copied,
    volume,
    onCopyCode,
    onGameDataFetched,
    onVolumeChange,
    fetchLiveGameLabel,
    connectedUsersLabel,
    noUsersConnectedLabel,
    roomCodeLabel,
    connectedLabel,
    disconnectedLabel,
    copyLabel,
    copiedLabel,
    soundLabel,
    soundOnLabel,
    soundOffLabel,
    flashNotificationSoundLabel,
  } = props

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      snapPoints={['70%', '90%']}
    >
      <RoomSettingsFetchSection
        title={fetchLiveGameLabel}
        onGameDataFetched={onGameDataFetched}
      />

      <RoomSettingsUsersSection
        title={connectedUsersLabel}
        users={users}
        emptyText={noUsersConnectedLabel}
      />

      <RoomSettingsRoomCodeSection
        title={roomCodeLabel}
        roomId={roomId}
        isConnected={isConnected}
        copied={copied}
        connectedLabel={connectedLabel}
        disconnectedLabel={disconnectedLabel}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        onCopy={onCopyCode}
      />

      <RoomSettingsSoundSection
        title={soundLabel}
        soundOnLabel={soundOnLabel}
        soundOffLabel={soundOffLabel}
        subtitle={flashNotificationSoundLabel}
        volume={volume}
        onVolumeChange={onVolumeChange}
      />
    </BottomSheet>
  )
})
