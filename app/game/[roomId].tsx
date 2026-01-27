import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { BottomSheet, GlassButton } from '@/components/ui'
import {
  ConnectionIndicator,
  CustomToggle,
  RoleCard,
  SettingsCard,
  SettingsSection,
} from '@/features/game/components'
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants'
import { GameProvider, useGameContext } from '@/features/game/contexts'
import type { TRole } from '@/features/game/types/game.types'
import { colors } from '@/lib/colors'
import { useUserStore } from '@/stores/user.store'

const MultiplayerGameContent = () => {
  const router = useRouter()
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    gameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    audio,
    isConnected,
  } = useGameContext()

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
              Connecting to server...
            </Text>
          </View>
        )}

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-row flex-wrap justify-center px-2 pb-6 pt-2"
        >
          {LEAGUE_ROLES.map((role) => (
            <View key={role.name} className="w-1/2 p-2">
              <RoleCard
                role={role}
                data={gameState.roles[role.name]}
                onFlashPress={() => handleFlashPress(role.name)}
                onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
                onToggleRune={() => toggleItem(role.name, 'cosmicInsight')}
                onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              />
            </View>
          ))}
        </ScrollView>

        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="Room Settings"
        >
          {/* Users Section */}
          <SettingsSection
            icon="people"
            iconColor={colors.gold}
            title={`Connected Users (${gameState.users.length})`}
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
                No users connected yet
              </Text>
            )}
          </SettingsSection>

          {/* Room Code Section */}
          <SettingsSection
            icon="key"
            iconColor={colors.goldLight}
            title="Room Code"
          >
            <SettingsCard
              leftElement={
                <ConnectionIndicator status={connectionStatus} size="lg" />
              }
              title={roomId || ''}
              subtitle={isConnected ? 'Connected' : 'Disconnected'}
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
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </View>
              }
            />
          </SettingsSection>

          {/* Sound Section */}
          <SettingsSection
            icon="musical-notes"
            iconColor={colors.info}
            title="Sound"
            className=""
          >
            <SettingsCard
              icon={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
              title={audio.volume === 'on' ? 'Sound On' : 'Sound Off'}
              subtitle="Flash notification sound"
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
  const username = useUserStore((state) => state.username)

  return (
    <GameProvider roomId={roomId} username={username || 'Guest'}>
      <MultiplayerGameContent />
    </GameProvider>
  )
}
