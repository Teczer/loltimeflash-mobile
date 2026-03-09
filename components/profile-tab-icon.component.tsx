import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Icon, VectorIcon } from 'expo-router/unstable-native-tabs'
import { memo } from 'react'
import { Image, Platform, View } from 'react-native'

import { TABS_CONFIG } from '@/app/(tabs)/tabs.config'
import { colors } from '@/lib/colors'
import { getAvatarUrl } from '@/lib/pocketbase.utils'
import { useAuthStore } from '@/stores/auth.store'

const USER_AVATAR_SIZE = 30
const BORDER_WIDTH = 1

const PROFILE_ICONS = TABS_CONFIG.PROFILE.icons

interface IProfileTabIconProps {
  color: string
  focused?: boolean
}

export const ProfileTabIcon = memo((props: IProfileTabIconProps) => {
  const { color, focused = false } = props
  const user = useAuthStore((s) => s.user)

  if (!user?.avatar) {
    return <FontAwesome name={PROFILE_ICONS.fa} size={24} color={color} />
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

export const useProfileNativeTabIcon = () => {
  const user = useAuthStore((s) => s.user)
  const avatarUrl = user ? getAvatarUrl(user) : null

  if (avatarUrl) {
    return <Icon src={{ uri: avatarUrl }} />
  }

  if (Platform.OS === 'ios') {
    return <Icon sf={PROFILE_ICONS.sf} />
  }

  return <Icon src={<VectorIcon family={MaterialIcons} name={PROFILE_ICONS.md} />} />
}
