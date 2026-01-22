import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Linking, Platform, Pressable, Text, View } from 'react-native';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { Button, GlassButton, TitleText } from '@/components/ui';
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
      <StyledSafeAreaView className="flex-1 px-4" edges={['top']}>
        {/* Floating Glass Settings Button */}
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons name="settings-outline" size={22} color={colors.foreground} />
        </GlassButton>

        {/* Content */}
        <View className="flex-1 flex-col items-center justify-center gap-12 px-6">
          {/* Header with Flash Icon */}
          <View className="flex-row items-center gap-x-4">
            <TitleText size="lg">Welcome to LolTimeFlash!</TitleText>
            <Image
              source={require('@/assets/images/roles/flash-icon.webp')}
              className="size-12 rounded-lg rotate-6"
              resizeMode="cover"
            />
          </View>

          {/* Start Game Button */}
          <View className="w-full">
            <Button
              variant="outline"
              onPress={handleStartGame}
              className="w-full py-4"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="flash" size={20} color={colors.foreground} />
                <Text className="font-sans-bold text-lg text-foreground">
                  Start Game
                </Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-center gap-1 pb-24">
          <Text className="text-xs text-muted-foreground">Made with ❤️ by</Text>
          <Pressable onPress={() => Linking.openURL('https://github.com/Teczer')}>
            <Text className="font-sans-bold text-xs text-foreground">@Teczer_</Text>
          </Pressable>
        </View>
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}
