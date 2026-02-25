import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Alert, Text, View } from 'react-native'

import { Button, DynamicButton, TextInput } from '@/components/ui'
import {
  nameSchema,
  type TNameFormData,
} from '@/features/auth/schemas/profile.schema'
import { useTranslation } from '@/hooks/use-translation.hook'
import type { IUser } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

interface IProfilePersonalFormContentProps {
  user: IUser
  onClose: () => void
}

export const ProfilePersonalFormContent = memo(
  (props: IProfilePersonalFormContentProps) => {
    const { user, onClose } = props
    const { t } = useTranslation()
    const updateProfile = useAuthStore((s) => s.updateProfile)
    const isLoading = useAuthStore((s) => s.isLoading)

    const {
      control,
      handleSubmit,
      reset,
      setValue,
      trigger,
      formState: { isDirty, errors },
    } = useForm<TNameFormData>({
      resolver: zodResolver(nameSchema),
      defaultValues: { name: user.name },
    })

    const name = useWatch({ control, name: 'name', defaultValue: user.name })

    const handleSave = useCallback(
      async (data: TNameFormData) => {
        if (data.name === user.name) {
          onClose()
          return
        }
        try {
          await updateProfile({ name: data.name })
          reset({ name: data.name })
          onClose()
        } catch {
          Alert.alert(t.game.error, t.auth.registerError)
        }
      },
      [user.name, updateProfile, reset, onClose, t]
    )

    return (
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-muted-foreground font-sans text-xs">
            {t.settings.name}
          </Text>
          <TextInput
            value={name ?? ''}
            onChangeText={(text) =>
              setValue('name', text, { shouldDirty: true })
            }
            onBlur={() => trigger('name')}
            autoCapitalize="words"
            maxLength={50}
          />
          {errors.name && (
            <Text className="text-danger font-sans text-xs">
              {errors.name.message}
            </Text>
          )}
        </View>
        <View className="flex-row gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onPress={onClose}>
            {t.auth.cancel}
          </Button>
          <DynamicButton
            variant="primary"
            className="flex-1"
            onPress={handleSubmit(handleSave)}
            disabled={!isDirty || isLoading}
            isLoading={isLoading}
            loadingText={t.settings.save}
          >
            {t.settings.save}
          </DynamicButton>
        </View>
      </View>
    )
  }
)
