import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { BottomSheet, GlassButton } from '@/components/ui'
import { RoleCard, SummonerInput } from '@/features/game/components'
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants'
import { GameProvider, useGameContext } from '@/features/game/contexts'
import type { TRole } from '@/features/game/types/game.types'
import type { ILiveGameData } from '@/features/game/types/riot.types'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { mapEnemyParticipantsToRoles } from '@/lib/riot-role-mapping.util'

const SoloGameContent = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    gameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
    audio,
  } = useGameContext()

  const handleFlashPress = (role: TRole) => {
    const roleData = gameState.roles[role]
    if (typeof roleData.isFlashed === 'number') {
      cancelFlash(role)
    } else {
      useFlash(role)
    }
  }

  const handleGameDataFetched = (data: ILiveGameData) => {
    const roleMapping = mapEnemyParticipantsToRoles(data.enemies)
    updateChampionData(roleMapping, {
      gameId: data.gameId,
      gameStartTime: data.gameStartTime,
    })
    setIsSheetOpen(false)
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>

          <View className="flex-row items-center gap-2">
            <GlassButton onPress={() => setIsSheetOpen(true)}>
              <Ionicons
                name="game-controller"
                size={22}
                color={colors.foreground}
              />
            </GlassButton>

            <GlassButton onPress={audio.toggleVolume}>
              <Ionicons
                name={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
                size={22}
                color={colors.foreground}
              />
            </GlassButton>
          </View>
        </View>

        {/* Role Grid - 2-1-2 layout */}
        <View className="flex-1 justify-center gap-y-4 px-2 pb-4">
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

        {/* Live Game Fetch Sheet */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={t.game.fetchLiveGame}
        >
          <SummonerInput onGameDataFetched={handleGameDataFetched} />
        </BottomSheet>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}

export default function SoloGameScreen() {
  return (
    <GameProvider>
      <SoloGameContent />
    </GameProvider>
  )
}
