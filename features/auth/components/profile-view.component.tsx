import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'

import { Button, TextInput, TitleText } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import config from '@/lib/config'
import type { IUser } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

import { z } from 'zod'

const nameSchema = z.object({
  name: z.string().min(2),
})
type TNameForm = z.infer<typeof nameSchema>

interface IProfileViewProps {
  user: IUser
}

const ProfileViewComponent = (props: IProfileViewProps) => {
  const { user } = props
  const { t, language } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const deleteAccount = useAuthStore((s) => s.deleteAccount)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [isEditing, setIsEditing] = useState(false)

  const avatarUrl = user.avatar
    ? `${config.pocketbaseUrl}/api/files/users/${user.id}/${user.avatar}`
    : null

  const memberDate = new Date(user.created).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long' },
  )

  const { control, handleSubmit, reset } = useForm<TNameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user.name },
  })

  const onUpdateName = async (data: TNameForm) => {
    try {
      await updateProfile({ name: data.name })
      setIsEditing(false)
    } catch {
      Alert.alert(t.game.error, t.auth.registerError)
    }
  }

  const handleLogout = () => {
    Alert.alert(t.auth.logout, t.auth.logoutConfirm, [
      { text: t.auth.cancel, style: 'cancel' },
      {
        text: t.auth.logout,
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(t.auth.deleteAccountConfirm, t.auth.deleteAccountWarning, [
      { text: t.auth.cancel, style: 'cancel' },
      {
        text: t.auth.deleteAccount,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount()
          } catch {
            Alert.alert(t.game.error)
          }
        },
      },
    ])
  }

  return (
    <View className="gap-6">
      {/* Profile Header */}
      <View className="items-center gap-3 pt-4">
        <View className="size-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="size-20"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={36} color={colors.mutedForeground} />
          )}
        </View>

        <View className="items-center gap-1">
          <TitleText size="md">{user.name}</TitleText>
          <Text className="text-muted-foreground font-sans text-sm">
            {user.email}
          </Text>
          <Text className="text-muted-foreground font-sans text-xs">
            {t.auth.member.replace('{date}', memberDate)}
          </Text>
        </View>
      </View>

      {/* Edit Profile Section */}
      <View className="gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-medium text-foreground text-base">
            {t.auth.editProfile}
          </Text>
          <Pressable
            onPress={() => {
              if (isEditing) {
                reset({ name: user.name })
              }
              setIsEditing(!isEditing)
            }}
          >
            <Ionicons
              name={isEditing ? 'close' : 'create-outline'}
              size={20}
              color={colors.gold}
            />
          </Pressable>
        </View>

        {isEditing ? (
          <View className="gap-3">
            <View className="gap-1.5">
              <Text className="font-sans text-muted-foreground text-sm">
                {t.auth.name}
              </Text>
              <View className="flex-row gap-2">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      className="flex-1"
                      onSubmitEditing={handleSubmit(onUpdateName)}
                    />
                  )}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onPress={handleSubmit(onUpdateName)}
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={colors.foreground}
                      />
                    ) : (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.foreground}
                      />
                    )
                  }
                />
              </View>
            </View>
          </View>
        ) : (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="person" size={16} color={colors.mutedForeground} />
              <Text className="text-muted-foreground font-sans text-sm">
                {t.auth.name}:
              </Text>
              <Text className="font-sans-medium text-foreground text-sm">
                {user.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="mail" size={16} color={colors.mutedForeground} />
              <Text className="text-muted-foreground font-sans text-sm">
                {t.auth.email}:
              </Text>
              <Text className="font-sans-medium text-foreground text-sm">
                {user.email}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="gap-3">
        <Button variant="outline" onPress={handleLogout}>
          {t.auth.logout}
        </Button>

        <Button variant="destructive" onPress={handleDeleteAccount}>
          {t.auth.deleteAccount}
        </Button>
      </View>
    </View>
  )
}

export const ProfileView = memo(ProfileViewComponent)
