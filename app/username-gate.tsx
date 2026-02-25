import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import { UsernameForm } from '@/features/settings/components'
import { colors } from '@/lib/colors'
import { useUserStore } from '@/stores'
import { useAuthStore } from '@/stores/auth.store'

export default function UsernameGateScreen() {
  const router = useRouter()
  const { redirect, roomId } = useLocalSearchParams<{
    redirect: 'create' | 'join'
    roomId?: string
  }>()
  const user = useAuthStore((s) => s.user)
  const localUsername = useUserStore((s) => s.username)
  const username = user?.name ?? localUsername

  // When username is set (account or local), redirect to the intended destination
  useEffect(() => {
    if (username) {
      if (redirect === 'create') {
        // Generate a room code and navigate
        const roomCode = generateRoomCode()
        router.replace(`/game/${roomCode}`)
      } else if (redirect === 'join' && roomId) {
        router.replace(`/game/${roomId}`)
      } else {
        // Fallback to multiplayer
        router.back()
      }
    }
  }, [username, redirect, roomId, router])

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header - Just back button */}
        <View className="px-4 py-3">
          <GlassButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </GlassButton>
        </View>

        {/* Centered Content */}
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="flex-grow items-center justify-center px-6"
          showsVerticalScrollIndicator={false}
          bottomOffset={50}
        >
          <UsernameForm withHeightAnimation={false} />
        </KeyboardAwareScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}

function generateRoomCode(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
