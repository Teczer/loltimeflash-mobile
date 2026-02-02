import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import { RoleCard } from '@/features/game/components'
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants'
import { GameProvider, useGameContext } from '@/features/game/contexts'
import type { TRole } from '@/features/game/types/game.types'
import { colors } from '@/lib/colors'

const SoloGameContent = () => {
  const router = useRouter()
  const { gameState, useFlash, cancelFlash, toggleItem, adjustTimer, audio } =
    useGameContext()

  const handleFlashPress = (role: TRole) => {
    const roleData = gameState.roles[role]
    if (typeof roleData.isFlashed === 'number') {
      cancelFlash(role)
    } else {
      useFlash(role)
    }
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>

          <Text className="font-sans-bold text-foreground text-lg">
            Solo Mode
          </Text>

          <GlassButton onPress={audio.toggleVolume}>
            <Ionicons
              name={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
              size={22}
              color={colors.foreground}
            />
          </GlassButton>
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
