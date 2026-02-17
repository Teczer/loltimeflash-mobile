import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'

import { Button, TextInput } from '@/components/ui'
import {
  loginSchema,
  type TLoginForm,
} from '@/features/auth/schemas/auth.schema'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

interface ILoginFormProps {
  onSwitchToRegister: () => void
}

const LoginFormComponent = (props: ILoginFormProps) => {
  const { onSwitchToRegister } = props
  const { t } = useTranslation()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: TLoginForm) => {
    try {
      await login(data)
    } catch {
      Alert.alert(t.game.error, t.auth.loginError)
    }
  }

  return (
    <View className="gap-5">
      <View className="gap-3">
        <View className="gap-1.5">
          <Text className="font-sans-medium text-foreground text-sm">
            {t.auth.email}
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t.auth.enterEmail}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
            )}
          />
        </View>

        <View className="gap-1.5">
          <Text className="font-sans-medium text-foreground text-sm">
            {t.auth.password}
          </Text>
          <View className="relative">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={t.auth.enterPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="password"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        icon={
          isLoading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : undefined
        }
      >
        {t.auth.signIn}
      </Button>

      <Pressable onPress={onSwitchToRegister} className="items-center py-2">
        <Text className="text-muted-foreground font-sans text-sm">
          {t.auth.noAccount}{' '}
          <Text className="font-sans-bold text-gold">{t.auth.signUp}</Text>
        </Text>
      </Pressable>
    </View>
  )
}

export const LoginForm = memo(LoginFormComponent)
