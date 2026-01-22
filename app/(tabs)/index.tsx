import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Platform, Text, View } from 'react-native';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { Button, GlassButton } from '@/components/ui';
import { colors } from '@/lib/colors';

export default function HomeScreen() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('/game/solo');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Floating Glass Settings Button */}
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons name="settings-outline" size={22} color={colors.foreground} />
        </GlassButton>

        {/* Content */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Header with Flash Icon */}
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl font-bold text-foreground">
              LolTimeFlash
            </Text>
            <Image
              source={require('@/assets/images/roles/flash-icon.webp')}
              className="h-14 w-14 rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Subtitle */}
          <Text className="mt-4 text-center text-lg text-muted-foreground">
            Track enemy Flash cooldowns in real-time
          </Text>

          {/* Start Game Button */}
          <View className="mt-12 w-full">
            <Button
              variant="outline"
              onPress={handleStartGame}
              className="w-full py-4"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="flash" size={20} color={colors.foreground} />
                <Text className="text-lg font-semibold text-foreground">Start Game</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View className="pb-24">
          <Text className="text-center text-xs text-muted-foreground">
            LolTimeFlash is not endorsed by Riot Games
          </Text>
        </View>
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}
