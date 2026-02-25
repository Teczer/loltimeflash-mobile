import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'

import { BackgroundImage } from '@/components/background-image.component'
import { GlassButton } from '@/components/ui'
import { ProfileAuthView, ProfileView } from '@/features/auth/components'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

export default function ProfileScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const handleOpenSettings = useCallback(() => {
    router.push('/settings')
  }, [router])

  const handleNeedOTP = useCallback(
    (email: string, password: string, isNewRegistration: boolean) => {
      router.push({
        pathname: '/verify-otp',
        params: {
          email,
          password,
          isNewRegistration: String(isNewRegistration),
        },
      })
    },
    [router]
  )

  if (isAuthenticated && user) {
    return (
      <BackgroundImage variant="fast">
        <View className="flex-1">
          <ProfileView
            user={user}
            rightComponent={
              <GlassButton onPress={handleOpenSettings}>
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color={colors.foreground}
                />
              </GlassButton>
            }
          />
        </View>
      </BackgroundImage>
    )
  }

  return (
    <ProfileAuthView
      onOpenSettings={handleOpenSettings}
      onNeedOTP={handleNeedOTP}
    />
  )
}
