import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import {
  ConnectionIndicator,
  RoleCard,
  RoomCodeCopyButton,
  RoomSettingsSheet,
} from '@/features/game/components'
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants'
import { GameProvider, useGameContext } from '@/features/game/contexts'
import type { TRole } from '@/features/game/types/game.types'
import type { ILiveGameData } from '@/features/game/types/riot.types'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { mapEnemyParticipantsToRoles } from '@/lib/riot-role-mapping.util'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'

const MultiplayerGameContent = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    gameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
    audio,
    isConnected,
  } = useGameContext()

  const handleGameDataFetched = (data: ILiveGameData) => {
    const roleMapping = mapEnemyParticipantsToRoles(data.enemies)
    updateChampionData(roleMapping, {
      gameId: data.gameId,
      gameStartTime: data.gameStartTime,
    })
  }

  const connectionStatus = isConnected ? 'connected' : 'disconnected'

  const handleFlashPress = (role: TRole) => {
    const roleData = gameState.roles[role]
    if (typeof roleData.isFlashed === 'number') {
      cancelFlash(role)
    } else {
      useFlash(role)
    }
  }

  const handleCopyCode = async () => {
    if (!roomId) return
    await Clipboard.setStringAsync(roomId)
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <Pressable
            onPress={() => router.back()}
            className="size-10 items-center justify-center rounded-full active:scale-95 active:bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Pressable>

          <RoomCodeCopyButton
            roomId={roomId || ''}
            connectionStatus={connectionStatus}
            copied={copied}
            onPress={handleCopyCode}
          />

          <GlassButton size={40} onPress={() => setIsSheetOpen(true)}>
            <Ionicons name="people" size={20} color={colors.foreground} />
          </GlassButton>
        </View>

        {!isConnected && (
          <View className="bg-warning/20 mx-4 mt-2 flex-row items-center justify-center gap-2 rounded-lg p-3">
            <ConnectionIndicator status="reconnecting" size="sm" />
            <Text className="text-warning text-center text-sm">
              {t.game.connectingToServer}
            </Text>
          </View>
        )}

        {/* Role Grid - 2-1-2 layout */}
        <View className="flex-1 justify-evenly px-2 pb-4">
          {/* Row 1: TOP, JUNGLE */}
          <View className="flex-row justify-evenly">
            {LEAGUE_ROLES.slice(0, 2).map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                data={gameState.roles[role.name]}
                onFlashPress={() => handleFlashPress(role.name)}
                onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
                onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              />
            ))}
          </View>

          {/* Row 2: MID (centered) */}
          <View className="flex-row justify-center">
            <RoleCard
              role={LEAGUE_ROLES[2]}
              data={gameState.roles[LEAGUE_ROLES[2].name]}
              onFlashPress={() => handleFlashPress(LEAGUE_ROLES[2].name)}
              onToggleBoots={() =>
                toggleItem(LEAGUE_ROLES[2].name, 'lucidityBoots')
              }
              onAdjustTimer={(seconds) =>
                adjustTimer(LEAGUE_ROLES[2].name, seconds)
              }
            />
          </View>

          {/* Row 3: ADC, SUPPORT */}
          <View className="flex-row justify-evenly">
            {LEAGUE_ROLES.slice(3, 5).map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                data={gameState.roles[role.name]}
                onFlashPress={() => handleFlashPress(role.name)}
                onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
                onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              />
            ))}
          </View>
        </View>

        <RoomSettingsSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={t.game.roomSettings}
          roomId={roomId || ''}
          users={gameState.users}
          isConnected={isConnected}
          copied={copied}
          volume={audio.volume}
          onCopyCode={handleCopyCode}
          onGameDataFetched={handleGameDataFetched}
          onVolumeChange={(value) => {
            const target = value ? 'on' : 'off'
            if (audio.volume !== target) audio.toggleVolume()
          }}
          fetchLiveGameLabel={t.game.fetchLiveGame}
          connectedUsersLabel={t.game.connectedUsers.replace(
            '{count}',
            String(gameState.users.length)
          )}
          noUsersConnectedLabel={t.game.noUsersConnected}
          roomCodeLabel={t.game.roomCode}
          connectedLabel={t.common.connected}
          disconnectedLabel={t.common.disconnected}
          copyLabel={t.common.copy}
          copiedLabel={t.common.copied}
          soundLabel={t.game.sound}
          soundOnLabel={t.game.soundOn}
          soundOffLabel={t.game.soundOff}
          flashNotificationSoundLabel={t.game.flashNotificationSound}
        />
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}

export default function MultiplayerGameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const user = useAuthStore((s) => s.user)
  const localUsername = useUserStore((s) => s.username)
  const username = user?.name ?? localUsername ?? 'Guest'

  return (
    <GameProvider roomId={roomId} username={username}>
      <MultiplayerGameContent />
    </GameProvider>
  )
}
