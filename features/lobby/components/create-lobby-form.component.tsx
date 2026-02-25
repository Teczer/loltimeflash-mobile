import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert, Text, View } from 'react-native'

import { Button, TextInput } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { generateLobbyCode } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores'

import { type TCreateLobbyFormData } from '@/features/lobby/schemas'

// Dynamically import expo-clipboard
let Clipboard: typeof import('expo-clipboard') | null = null
try {
  Clipboard = require('expo-clipboard')
} catch (e) {
  console.warn('expo-clipboard not available')
}

export const CreateLobbyForm = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const user = useAuthStore((s) => s.user)
  const localUsername = useUserStore((s) => s.username)
  const username = user?.name ?? localUsername

  const { control, setValue } = useForm<TCreateLobbyFormData>({
    defaultValues: {
      lobbyCode: '',
    },
  })

  const lobbyCode = useWatch({ control, name: 'lobbyCode' })

  const handleCreateLobby = () => {
    const code = generateLobbyCode(10)
    setValue('lobbyCode', code)
  }

  const handleCopyCode = async () => {
    if (lobbyCode) {
      if (Clipboard) {
        await Clipboard.setStringAsync(lobbyCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        Alert.alert(t.lobby.lobbyCode, lobbyCode, [{ text: t.common.ok }])
      }
    }
  }

  const handleJoinLobby = () => {
    if (!lobbyCode) return

    // If no username, redirect to gate first
    if (!username) {
      router.push({
        pathname: '/username-gate',
        params: { redirect: 'join', roomId: lobbyCode },
      })
      return
    }

    router.push(`/game/${lobbyCode}`)
  }

  return (
    <View className="w-full items-center gap-6">
      <Text className="font-sans-bold text-foreground text-xl">
        {t.lobby.createTitle}
      </Text>

      {!lobbyCode ? (
        <Button variant="outline" onPress={handleCreateLobby}>
          {t.lobby.createButton}
        </Button>
      ) : (
        <View className="w-full items-center gap-4">
          <Text className="text-muted-foreground">{t.lobby.lobbyCodeIs}</Text>

          <View className="w-full flex-row items-center gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name="lobbyCode"
                render={({ field: { value } }) => (
                  <TextInput
                    value={value}
                    editable={false}
                    className="font-mono tracking-wider"
                  />
                )}
              />
            </View>
            <Button
              variant="outline"
              size="icon"
              onPress={handleCopyCode}
              icon={
                <Ionicons
                  name={copied ? 'checkmark' : 'copy'}
                  size={18}
                  color={colors.foreground}
                />
              }
            />
          </View>

          <Button
            variant="outline"
            onPress={handleJoinLobby}
            icon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.foreground}
              />
            }
          >
            {t.lobby.joinButton}
          </Button>
        </View>
      )}
    </View>
  )
}
