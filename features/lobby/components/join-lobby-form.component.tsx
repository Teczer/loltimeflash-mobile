import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import { Button, TextInput } from '@/components/ui'
import { LOBBY_CODE_LENGTH } from '@/features/game/constants/game.constants'
import { colors } from '@/lib/colors'
import { useUserStore } from '@/stores'

import {
  joinLobbySchema,
  type TJoinLobbyFormData,
} from '@/features/lobby/schemas'

export const JoinLobbyForm = () => {
  const router = useRouter()
  const username = useUserStore((s) => s.username)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TJoinLobbyFormData>({
    resolver: zodResolver(joinLobbySchema),
    defaultValues: {
      lobbyCode: '',
    },
  })

  const onSubmit = (data: TJoinLobbyFormData) => {
    // If no username, redirect to gate first
    if (!username) {
      router.push({
        pathname: '/username-gate',
        params: { redirect: 'join', roomId: data.lobbyCode },
      })
      return
    }

    router.push(`/game/${data.lobbyCode}`)
  }

  return (
    <View className="w-full items-center gap-6">
      <Text className="font-sans-bold text-foreground text-xl">
        Join a Lobby
      </Text>

      <View className="w-full flex-row items-center gap-2">
        <View className="flex-1">
          <Controller
            control={control}
            name="lobbyCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter lobby code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={LOBBY_CODE_LENGTH}
                returnKeyType="join"
                onSubmitEditing={handleSubmit(onSubmit)}
                className="font-mono tracking-wider"
              />
            )}
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          onPress={handleSubmit(onSubmit)}
          icon={
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.foreground}
            />
          }
        />
      </View>

      {errors.lobbyCode && (
        <Text className="text-destructive text-sm">
          {errors.lobbyCode.message}
        </Text>
      )}
    </View>
  )
}
