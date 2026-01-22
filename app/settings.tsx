import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppInfo } from '@/components/app-info.component';
import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { GlassButton, TitleText } from '@/components/ui';
import { BackgroundPicker, UsernameForm } from '@/features/settings/components';
import { colors } from '@/lib/colors';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center gap-4 px-4 py-3">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>
          <TitleText size="md">Settings</TitleText>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Username Section */}
          <View className="mt-8">
            <UsernameForm />
          </View>

          {/* Background Section */}
          <View className="mt-12 gap-4">
            <Text className="font-sans-bold text-lg text-foreground">Background</Text>
            <BackgroundPicker />
          </View>
        </ScrollView>

        <AppInfo />
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}
