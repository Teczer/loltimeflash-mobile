import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { GlassButton } from '@/components/ui';
import { CreateLobbyForm, JoinLobbyForm } from '@/features/lobby/components';
import { colors } from '@/lib/colors';

export default function MultiplayerScreen() {
  const router = useRouter();

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1 px-6" edges={['top']}>
        {/* Floating Glass Settings Button */}
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons name="settings-outline" size={22} color={colors.foreground} />
        </GlassButton>

        {/* Content */}
        <View className="flex-1 items-center justify-center gap-8">
 

          <CreateLobbyForm />

          {/* Divider */}
          <View className="flex-row items-center gap-4">
            <View className="h-px w-16 bg-[#C4A15B]" />
            <View className="rounded-full bg-white/10 px-4 py-2">
              <Ionicons name="cloud" size={20} color={colors.border} />
            </View>
            <View className="h-px w-16 bg-[#C4A15B]" />
          </View>

          <JoinLobbyForm />
        </View>
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}
