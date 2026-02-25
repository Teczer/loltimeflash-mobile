import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Text, View } from 'react-native'

import { Button, DynamicButton, TextInput } from '@/components/ui'
import {
  passwordSchema,
  type TPasswordFormData,
} from '@/features/auth/schemas/profile.schema'
import { useTranslation } from '@/hooks/use-translation.hook'
import { useAuthStore } from '@/stores/auth.store'

interface IProfilePasswordFormContentProps {
  onClose: () => void
}

export const ProfilePasswordFormContent = memo(
  (props: IProfilePasswordFormContentProps) => {
    const { onClose } = props
    const { t } = useTranslation()
    const updatePassword = useAuthStore((s) => s.updatePassword)
    const isLoading = useAuthStore((s) => s.isLoading)

    const form = useForm<TPasswordFormData>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    })

    const handleSave = useCallback(
      async (data: TPasswordFormData) => {
        try {
          await updatePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          })
          form.reset()
          onClose()
        } catch {
          Alert.alert(t.game.error, t.auth.registerError)
        }
      },
      [updatePassword, form, onClose, t]
    )

    const handleClose = useCallback(() => {
      form.reset()
      onClose()
    }, [form, onClose])

    return (
      <View className="gap-4">
        <Controller
          control={form.control}
          name="currentPassword"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className="gap-1">
              <Text className="text-muted-foreground font-sans text-xs">
                {t.settings.currentPassword}
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t.settings.currentPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error && (
                <Text className="text-danger font-sans text-xs">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="newPassword"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className="gap-1">
              <Text className="text-muted-foreground font-sans text-xs">
                {t.settings.newPassword}
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t.settings.newPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error && (
                <Text className="text-danger font-sans text-xs">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className="gap-1">
              <Text className="text-muted-foreground font-sans text-xs">
                {t.settings.confirmPassword}
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t.settings.confirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error && (
                <Text className="text-danger font-sans text-xs">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
        <View className="flex-row gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onPress={handleClose}>
            {t.auth.cancel}
          </Button>
          <DynamicButton
            variant="primary"
            className="flex-1"
            onPress={form.handleSubmit(handleSave)}
            disabled={!form.formState.isValid || isLoading}
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
