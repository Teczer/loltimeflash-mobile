import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Pressable, Text, View } from 'react-native'

import { DynamicButton, TextInput } from '@/components/ui'
import { useSendOTP } from '@/features/auth/hooks/use-otp.hook'
import {
  registerSchema,
  type TRegisterForm,
} from '@/features/auth/schemas/auth.schema'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

interface IRegisterFormProps {
  onSwitchToLogin: () => void
  onNeedOTP: (
    email: string,
    password: string,
    isNewRegistration: boolean
  ) => void
}

const RegisterFormComponent = (props: IRegisterFormProps) => {
  const { onSwitchToLogin, onNeedOTP } = props
  const { t } = useTranslation()
  const register = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendOTP()

  const { control, handleSubmit } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const generateDefaultPseudo = () => {
    const suffix = Math.floor(1000 + Math.random() * 9000)
    return `Player_${suffix}`
  }

  const onSubmit = async (data: TRegisterForm) => {
    try {
      await register({
        name: generateDefaultPseudo(),
        email: data.email,
        password: data.password,
      })

      try {
        await sendOTP(data.email)
        onNeedOTP(data.email, data.password, true)
      } catch {
        Alert.alert(t.game.error, t.auth.sendOtpError)
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'email_already_used') {
        Alert.alert(t.game.error, t.auth.emailAlreadyUsed)
        return
      }
      Alert.alert(t.game.error, t.auth.registerError)
    }
  }

  const busy = isLoading || isSendingOTP

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
                  textContentType="newPassword"
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
              )}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2"
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>

        <View className="gap-1.5">
          <Text className="font-sans-medium text-foreground text-sm">
            {t.auth.confirmPassword}
          </Text>
          <View className="relative">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={t.auth.confirmYourPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirmPassword}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  style={{ paddingRight: 44 }}
                />
              )}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2"
              hitSlop={8}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <DynamicButton
        onPress={handleSubmit(onSubmit)}
        disabled={busy}
        isLoading={busy}
        loadingText={t.auth.signUp}
      >
        {t.auth.signUp}
      </DynamicButton>

      <Pressable onPress={onSwitchToLogin} className="items-center py-2">
        <Text className="text-muted-foreground font-sans text-sm">
          {t.auth.alreadyAccount}{' '}
          <Text className="font-sans-bold text-gold">{t.auth.signIn}</Text>
        </Text>
      </Pressable>
    </View>
  )
}

export const RegisterForm = memo(RegisterFormComponent)
