import { memo, useCallback, useState } from 'react'
import { Alert, Text, View } from 'react-native'

import { AnimatedHeaderScrollView } from '@/components/organisms/animated-header-scrollview'
import { BottomSheet, DynamicButton } from '@/components/ui'
import {
  ProfileAvatarSection,
  ProfileInfoSections,
  ProfilePasswordFormContent,
  ProfilePersonalFormContent,
} from '@/features/auth/components/profile'
import { useTranslation } from '@/hooks/use-translation.hook'
import type { IUser } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

type TSheetType = 'personal' | 'password' | null

interface IProfileViewProps {
  user: IUser
  rightComponent?: React.ReactNode
}

const ProfileViewComponent = (props: IProfileViewProps) => {
  const { user, rightComponent } = props
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const [openSheet, setOpenSheet] = useState<TSheetType>(null)

  const handleLogout = useCallback(() => {
    Alert.alert(t.auth.logout, t.auth.logoutConfirm, [
      { text: t.auth.cancel, style: 'cancel' },
      {
        text: t.auth.logout,
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }, [t, logout])

  const getSheetTitle = () => {
    switch (openSheet) {
      case 'personal':
        return t.settings.personalInfo
      case 'password':
        return t.settings.changePassword
      default:
        return ''
    }
  }

  const getSnapPoints = (): [string, string] => {
    if (openSheet === 'personal') return ['30%', '90%']
    if (openSheet === 'password') return ['50%', '90%']
    return ['50%', '90%']
  }

  return (
    <>
      <AnimatedHeaderScrollView
        headerOnly
        rightComponent={rightComponent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="gap-2">
          <ProfileAvatarSection user={user} />
          <Text className="text-foreground mb-4 text-center text-2xl font-bold">
            {user.name}
          </Text>

          <ProfileInfoSections
            user={user}
            onEditName={() => setOpenSheet('personal')}
            onEditPassword={() => setOpenSheet('password')}
          />
          <DynamicButton
            variant="primary"
            onPress={handleLogout}
            className="mt-4"
          >
            {t.auth.logout}
          </DynamicButton>
        </View>
      </AnimatedHeaderScrollView>

      <BottomSheet
        isOpen={openSheet !== null}
        onClose={() => setOpenSheet(null)}
        title={getSheetTitle()}
        snapPoints={getSnapPoints()}
      >
        {openSheet === 'personal' && (
          <ProfilePersonalFormContent
            user={user}
            onClose={() => setOpenSheet(null)}
          />
        )}
        {openSheet === 'password' && (
          <ProfilePasswordFormContent onClose={() => setOpenSheet(null)} />
        )}
      </BottomSheet>
    </>
  )
}

export const ProfileView = memo(ProfileViewComponent)
