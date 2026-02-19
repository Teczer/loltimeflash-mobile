import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Alert, Image, Text, View } from 'react-native'

import { Button, TitleText } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { getAvatarUrl } from '@/lib/pocketbase.utils'
import type { IUser } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

interface IProfileViewProps {
  user: IUser
}

const ProfileViewComponent = (props: IProfileViewProps) => {
  const { user } = props
  const { t, language } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const deleteAccount = useAuthStore((s) => s.deleteAccount)

  const avatarUrl = getAvatarUrl(user)

  const memberDate = new Date(user.created).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long' },
  )

  const handleLogout = () => {
    Alert.alert(t.auth.logout, t.auth.logoutConfirm, [
      { text: t.auth.cancel, style: 'cancel' },
      {
        text: t.auth.logout,
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(t.auth.deleteAccountConfirm, t.auth.deleteAccountWarning, [
      { text: t.auth.cancel, style: 'cancel' },
      {
        text: t.auth.deleteAccount,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount()
          } catch {
            Alert.alert(t.game.error)
          }
        },
      },
    ])
  }

  return (
    <View className="gap-6">
      {/* Profile Header */}
      <View className="items-center gap-3 pt-4">
        <View className="size-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="size-20"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={36} color={colors.mutedForeground} />
          )}
        </View>

        <View className="items-center gap-1">
          <TitleText size="md">{user.name}</TitleText>
          <Text className="text-muted-foreground font-sans text-sm">
            {user.email}
          </Text>
          <Text className="text-muted-foreground font-sans text-xs">
            {t.auth.member.replace('{date}', memberDate)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="gap-3">
        <Button variant="outline" onPress={handleLogout}>
          {t.auth.logout}
        </Button>

        <Button variant="destructive" onPress={handleDeleteAccount}>
          {t.auth.deleteAccount}
        </Button>
      </View>
    </View>
  )
}

export const ProfileView = memo(ProfileViewComponent)
