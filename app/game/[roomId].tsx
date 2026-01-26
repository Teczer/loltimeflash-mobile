import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { GlassButton } from '@/components/ui';
import { RoleCard } from '@/features/game/components';
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants';
import { GameProvider, useGameContext } from '@/features/game/contexts';
import type { TRole } from '@/features/game/types/game.types';
import { colors } from '@/lib/colors';
import { useUserStore } from '@/stores/user.store';

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
    isConnected,
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
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>

          <View className="flex-row items-center gap-2">
            {/* Connection indicator */}
            <View
              className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <View className="items-center rounded-full bg-card/50 px-4 py-1">
              <Text className="font-mono text-sm text-foreground">{roomId}</Text>
            </View>
          </View>

          <GlassButton onPress={audio.toggleVolume}>
            <Ionicons
              name={audio.volume === 'on' ? 'volume-high' : 'volume-mute'}
              size={22}
              color={colors.foreground}
            />
          </GlassButton>
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

        {/* Connection status message */}
        {!isConnected && (
          <View className="mx-4 rounded-lg bg-orange-400/20 p-3">
            <Text className="text-center text-sm text-orange-400">
              Connecting to server...
            </Text>
          </View>
        )}

        {/* Role Grid */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-row flex-wrap justify-center px-2 pb-6"
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
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const username = useUserStore((state) => state.username);

  return (
    <GameProvider roomId={roomId} username={username || 'Guest'}>
      <MultiplayerGameContent />
    </GameProvider>
  );
}
