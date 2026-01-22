import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { RoleCard } from '@/features/game/components';
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants';
import { GameProvider, useGameContext } from '@/features/game/contexts';
import type { TRole } from '@/features/game/types/game.types';
import { colors } from '@/lib/colors';

const MultiplayerGameContent = () => {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const {
    gameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    audio,
  } = useGameContext();

  const handleFlashPress = (role: TRole) => {
    const roleData = gameState.roles[role];
    if (typeof roleData.isFlashed === 'number') {
      cancelFlash(role);
    } else {
      useFlash(role);
    }
  };

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>

          <View className="items-center rounded-full bg-card/50 px-4 py-1">
            <Text className="font-mono text-sm text-foreground">{roomId}</Text>
          </View>

          <Pressable onPress={audio.toggleVolume} className="p-2">
            <Ionicons
              name={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
              size={24}
              color={colors.foreground}
            />
          </Pressable>
        </View>

        {/* Users in Room */}
        {gameState.users.length > 0 && (
          <View className="flex-row flex-wrap justify-center gap-2 px-4 py-2">
            {gameState.users.map((user) => (
              <View key={user} className="rounded-full bg-card/50 px-3 py-1">
                <Text className="text-xs text-foreground">{user}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Role Grid */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingHorizontal: 8,
            paddingBottom: 24,
          }}
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
  );
};

export default function MultiplayerGameScreen() {
  return (
    <GameProvider>
      <MultiplayerGameContent />
    </GameProvider>
  );
}
