import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Platform, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import { CreateLobbyForm, JoinLobbyForm } from '@/features/lobby/components'
import { colors } from '@/lib/colors'

export default function MultiplayerScreen() {
  const router = useRouter()

  const handleOpenSettings = () => {
    router.push('/settings')
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
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
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="flex-grow items-center justify-center gap-8 px-6"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          <CreateLobbyForm />

          {/* Divider */}
          <View className="flex-row items-center gap-4">
            <View className="bg-muted-foreground h-px w-16" />
            <View className="rounded-full bg-white/10 px-4 py-2">
              <Ionicons name="cloud" size={20} color={colors.mutedForeground} />
            </View>
            <View className="bg-muted-foreground h-px w-16" />
          </View>

          <JoinLobbyForm />
        </KeyboardAwareScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
