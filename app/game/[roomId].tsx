import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { BottomSheet, GlassButton } from '@/components/ui'
import {
  ConnectionIndicator,
  CustomToggle,
  RoleCard,
  SettingsCard,
  SettingsSection,
  SummonerInput,
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

          <Pressable
            onPress={handleCopyCode}
            className="flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 active:bg-white/10"
          >
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
          </Pressable>

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
              onToggleBoots={() => toggleItem(LEAGUE_ROLES[2].name, 'lucidityBoots')}
              onAdjustTimer={(seconds) => adjustTimer(LEAGUE_ROLES[2].name, seconds)}
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

        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={t.game.roomSettings}
        >
          {/* Live Game Fetch */}
          <SettingsSection
            icon="game-controller"
            iconColor={colors.success}
            title={t.game.fetchLiveGame}
          >
            <SummonerInput onGameDataFetched={handleGameDataFetched} />
          </SettingsSection>

          {/* Users Section */}
          <SettingsSection
            icon="people"
            iconColor={colors.gold}
            title={t.game.connectedUsers.replace('{count}', String(gameState.users.length))}
          >
            {gameState.users.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {gameState.users.map((user) => (
                  <View
                    key={user}
                    className="flex-row items-center gap-1 rounded-full bg-white/10 py-1.5 pl-2 pr-3"
                  >
                    <ConnectionIndicator
                      status="connected"
                      size="sm"
                      animate={false}
                    />
                    <Text className="text-sm text-white">{user}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-white/50">
                {t.game.noUsersConnected}
              </Text>
            )}
          </SettingsSection>

          {/* Room Code Section */}
          <SettingsSection
            icon="key"
            iconColor={colors.goldLight}
            title={t.game.roomCode}
          >
            <SettingsCard
              leftElement={
                <ConnectionIndicator status={connectionStatus} size="lg" />
              }
              title={roomId || ''}
              subtitle={isConnected ? t.common.connected : t.common.disconnected}
              onPress={handleCopyCode}
              rightElement={
                <View className="flex-row items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
                  <Ionicons
                    name={copied ? 'checkmark' : 'copy-outline'}
                    size={16}
                    color={copied ? colors.success : colors.foreground}
                  />
                  <Text
                    className={`text-sm ${copied ? 'text-success' : 'text-white'}`}
                  >
                    {copied ? t.common.copied : t.common.copy}
                  </Text>
                </View>
              }
            />
          </SettingsSection>

          {/* Sound Section */}
          <SettingsSection
            icon="musical-notes"
            iconColor={colors.info}
            title={t.game.sound}
            className=""
          >
            <SettingsCard
              icon={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
              title={audio.volume === 'on' ? t.game.soundOn : t.game.soundOff}
              subtitle={t.game.flashNotificationSound}
              variant={audio.volume === 'on' ? 'gold' : 'muted'}
              rightElement={
                <CustomToggle
                  value={audio.volume === 'on'}
                  onValueChange={audio.toggleVolume}
                />
              }
            />
          </SettingsSection>
        </BottomSheet>
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
