import { Ionicons } from '@expo/vector-icons'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { memo, useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { getAvatarUrl } from '@/lib/pocketbase.utils'
import type { IUser } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

const AVATAR_SIZE = 120
const MAX_FILE_SIZE = 10 * 1024 * 1024

interface IProfileAvatarSectionProps {
  user: IUser
}

export const ProfileAvatarSection = memo(
  (props: IProfileAvatarSectionProps) => {
    const { user } = props
    const { t } = useTranslation()
    const updateAvatar = useAuthStore((s) => s.updateAvatar)
    const [avatarLoading, setAvatarLoading] = useState(false)

    const avatarUrl = getAvatarUrl(user)

    const pickAvatar = useCallback(async () => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert(t.game.error, 'Permission to access photos is required')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (result.canceled || !result.assets[0]) return

      const asset = result.assets[0]
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
        Alert.alert(t.game.error, t.onboarding.imageTooLarge)
        return
      }

      setAvatarLoading(true)
      try {
        const manipulated = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1024, height: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        )
        await updateAvatar(manipulated.uri)
      } catch {
        Alert.alert(t.game.error, t.auth.registerError)
      } finally {
        setAvatarLoading(false)
      }
    }, [t, updateAvatar])

    return (
      <View className="items-center gap-3">
        <Pressable
          onPress={pickAvatar}
          disabled={avatarLoading}
          className="items-center justify-center transition-all active:opacity-60"
          hitSlop={10}
        >
          <View
            className="items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          >
            {avatarLoading ? (
              <ActivityIndicator size="large" color={colors.gold} />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={56}
                color={colors.mutedForeground}
              />
            )}
          </View>
        </Pressable>
      </View>
    )
  }
)
