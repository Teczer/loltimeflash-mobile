import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { usePathname } from 'expo-router'
import { Icon, VectorIcon } from 'expo-router/unstable-native-tabs'
import { memo } from 'react'
import { Image, Platform, View } from 'react-native'

import { colors } from '@/lib/colors'
import { getAvatarUrl } from '@/lib/pocketbase.utils'
import { useAuthStore } from '@/stores/auth.store'

const USER_AVATAR_SIZE = 30
const BORDER_WIDTH = 1

interface IProfileTabIconProps {
  color: string
  focused?: boolean
}

export const ProfileTabIcon = memo((props: IProfileTabIconProps) => {
  const { color, focused = false } = props
  const user = useAuthStore((s) => s.user)

  if (!user?.avatar) {
    return <FontAwesome name="user-circle" size={24} color={color} />
  }

  const borderColor = focused ? '#FFFFFF' : colors.mutedForeground
  const avatarUrl = getAvatarUrl(user)!
  return (
    <View
      style={{
        width: USER_AVATAR_SIZE,
        height: USER_AVATAR_SIZE,
        borderRadius: USER_AVATAR_SIZE / 2,
        borderWidth: BORDER_WIDTH,
        borderColor,
        overflow: 'hidden',
      }}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: USER_AVATAR_SIZE, height: USER_AVATAR_SIZE }}
        resizeMode="cover"
      />
    </View>
  )
})

export const ProfileTabIconNative = memo(() => {
  const user = useAuthStore((s) => s.user)
  const pathname = usePathname()
  const isProfileFocused = pathname.endsWith('profile')

  const borderColor = isProfileFocused ? '#FFFFFF' : colors.mutedForeground

  const avatarUrl = user ? getAvatarUrl(user) : null
  if (avatarUrl) {
    return (
      <View
        style={{
          width: USER_AVATAR_SIZE,
          height: USER_AVATAR_SIZE,
          borderRadius: USER_AVATAR_SIZE / 2,
          borderWidth: BORDER_WIDTH,
          borderColor,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: USER_AVATAR_SIZE, height: USER_AVATAR_SIZE }}
          resizeMode="cover"
        />
      </View>
    )
  }

  return Platform.OS === 'ios' ? (
    <Icon
      sf={{
        default: 'person.crop.circle',
        selected: 'person.crop.circle.fill',
      }}
    />
  ) : (
    <Icon src={<VectorIcon family={MaterialIcons} name="account-circle" />} />
  )
})
