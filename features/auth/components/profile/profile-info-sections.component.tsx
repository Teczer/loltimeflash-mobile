import { memo, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { sheetTheme } from '@/components/ui/bottom-sheet'
import { useTranslation } from '@/hooks/use-translation.hook'
import type { IUser } from '@/stores/auth.store'

import { ProfileDeleteFormContent } from './profile-delete-form-content.component'
import { ProfileSectionRow } from './profile-section-row.component'

interface IProfileInfoSectionsProps {
  user: IUser
  onEditName: () => void
  onEditPassword: () => void
}

export const ProfileInfoSections = memo((props: IProfileInfoSectionsProps) => {
  const { user, onEditName, onEditPassword } = props
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <View className="gap-6">
      <View className="gap-3">
        <Text className="text-foreground font-sans-bold text-sm">
          {t.settings.personalInfo}
        </Text>
        <View className="overflow-hidden rounded-xl">
          <ProfileSectionRow
            position="first"
            title={t.settings.name}
            value={user.name}
            onEdit={onEditName}
          />
          <ProfileSectionRow
            position="last"
            title={t.settings.email}
            value={user.email}
            isVerified={user.verified}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-foreground font-sans-bold text-sm">
          {t.settings.password}
        </Text>
        <View className="overflow-hidden rounded-xl">
          <ProfileSectionRow
            position="single"
            title={t.settings.changePassword}
            value="••••••••"
            onEdit={onEditPassword}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-foreground font-sans-bold text-sm">
          {t.settings.deleteAccount}
        </Text>
        <View className="overflow-hidden rounded-xl">
          <ProfileSectionRow
            position="single"
            title={t.settings.deleteAccount}
            value={t.settings.deleteAccountDescription}
            onEdit={() => setDeleteModalOpen(true)}
            variant="danger"
          />
        </View>
      </View>

      <Modal
        visible={deleteModalOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDeleteModalOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setDeleteModalOpen(false)}
        >
          <Pressable
            style={[styles.card, { boxShadow: sheetTheme.boxShadow } as object]}
            onPress={(e) => e.stopPropagation()}
          >
            <ProfileDeleteFormContent
              onClose={() => setDeleteModalOpen(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    backgroundColor: sheetTheme.cardBackground,
    borderColor: sheetTheme.cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    maxWidth: 400,
    padding: 24,
    width: '100%',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: sheetTheme.backdrop,
    flex: 1,
    justifyContent: 'center',
  },
})
