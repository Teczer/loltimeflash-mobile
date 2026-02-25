import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useState } from 'react'
import { Alert, Text, View } from 'react-native'

import { Button, DynamicButton, TextInput } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

interface IProfileDeleteFormContentProps {
  onClose: () => void
}

export const ProfileDeleteFormContent = memo(
  (props: IProfileDeleteFormContentProps) => {
    const { onClose } = props
    const { t } = useTranslation()
    const deleteAccount = useAuthStore((s) => s.deleteAccount)
    const isLoading = useAuthStore((s) => s.isLoading)
    const [deleteConfirm, setDeleteConfirm] = useState('')

    const handleDelete = useCallback(async () => {
      if (deleteConfirm !== 'DELETE') return
      try {
        await deleteAccount()
        setDeleteConfirm('')
        onClose()
      } catch {
        Alert.alert(t.game.error)
      }
    }, [deleteConfirm, deleteAccount, onClose, t])

    const handleClose = useCallback(() => {
      setDeleteConfirm('')
      onClose()
    }, [onClose])

    return (
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="bg-danger/20 size-10 items-center justify-center rounded-full">
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </View>
          <Text className="text-foreground flex-1 font-sans-bold">
            {t.settings.deleteConfirmTitle}
          </Text>
        </View>
        <Text className="text-muted-foreground font-sans text-sm">
          {t.settings.deleteConfirmMessage}
        </Text>
        <TextInput
          value={deleteConfirm}
          onChangeText={setDeleteConfirm}
          placeholder={t.settings.deleteConfirmPlaceholder}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <View className="flex-row gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onPress={handleClose}>
            {t.auth.cancel}
          </Button>
          <DynamicButton
            variant="destructive"
            className="flex-1"
            onPress={handleDelete}
            disabled={deleteConfirm !== 'DELETE' || isLoading}
            isLoading={isLoading}
            loadingText={t.settings.confirmDelete}
          >
            {t.settings.confirmDelete}
          </DynamicButton>
        </View>
      </View>
    )
  }
)
