import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

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

        {/* Role Grid */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-row flex-wrap justify-center px-2 pb-6"
          contentInsetAdjustmentBehavior="automatic"
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
