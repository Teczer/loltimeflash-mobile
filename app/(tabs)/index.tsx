import { Ionicons } from '@expo/vector-icons'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { useRouter } from 'expo-router'
import { Image, Linking, Platform, Pressable, Text, View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { Button, GlassButton, TitleText } from '@/components/ui'
import { colors } from '@/lib/colors'

const IS_NATIVE_TABS = isLiquidGlassAvailable()
const FOOTER_PADDING = IS_NATIVE_TABS
  ? Platform.OS === 'ios'
    ? 100
    : 72 // NativeTabs: larger padding
  : 24 // JavaScript Tabs: minimal padding

export default function HomeScreen() {
  const router = useRouter()

  const handleStartGame = () => {
    router.push('/game/solo')
  }

  const handleOpenSettings = () => {
    router.push('/settings')
  }

  return (
    <BackgroundImage variant="default">
      <StyledSafeAreaView className="flex-1 px-4" edges={['top']}>
        {/* Floating Glass Settings Button */}
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={colors.foreground}
          />
        </GlassButton>

        {/* Content */}
        <View className="flex-1 flex-col items-center justify-center gap-y-8 px-6">
          {/* Header with Flash Icon */}
          <View className="flex-row items-center gap-x-4">
            <TitleText size="md">Welcome to LolTimeFlash!</TitleText>
            <Image
              source={require('@/assets/images/roles/flash-icon.webp')}
              className="size-12 rotate-6 rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Start Game Button */}
          <View className="w-1/2">
            <Button
              variant="outline"
              size="default"
              onPress={handleStartGame}
              className="w-full"
            >
              Solo Lobby
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View
          className="flex-row items-center justify-center gap-1"
          style={{ paddingBottom: FOOTER_PADDING }}
        >
          <Text className="font-sans-bold text-foreground text-xs">
            Made with ❤️ by
          </Text>
          <Pressable
            onPress={() => Linking.openURL('https://github.com/Teczer')}
          >
            <Text className="font-sans-bold text-foreground text-xs">
              @Teczer_
            </Text>
          </Pressable>
        </View>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
