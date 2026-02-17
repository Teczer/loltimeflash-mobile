import { Ionicons } from '@expo/vector-icons'
import { memo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'

import { useOAuth } from '@/features/auth/hooks/use-oauth.hook'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import type { TOAuthProvider } from '@/stores/auth.store'

const PROVIDERS: { name: TOAuthProvider; icon: string; color: string }[] = [
  { name: 'google', icon: 'logo-google', color: '#4285F4' },
  { name: 'discord', icon: 'logo-discord', color: '#5865F2' },
]

const OAuthButtonsComponent = () => {
  const { t } = useTranslation()
  const { authenticate } = useOAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleOAuth = async (provider: TOAuthProvider) => {
    setLoadingProvider(provider)
    try {
      await authenticate(provider)
    } catch {
      Alert.alert(t.game.error, t.auth.loginError)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-white/10" />
        <Text className="text-muted-foreground font-sans text-xs uppercase">
          {t.auth.orContinueWith}
        </Text>
        <View className="h-px flex-1 bg-white/10" />
      </View>

      <View className="flex-row gap-3">
        {PROVIDERS.map((provider) => (
          <Pressable
            key={provider.name}
            onPress={() => handleOAuth(provider.name)}
            disabled={loadingProvider !== null}
            className="border-input flex-1 flex-row items-center justify-center gap-2 rounded-xl border bg-white/5 px-4 py-3.5 active:bg-white/10"
          >
            {loadingProvider === provider.name ? (
              <ActivityIndicator size="small" color={colors.foreground} />
            ) : (
              <>
                <Ionicons
                  name={provider.icon as any}
                  size={20}
                  color={provider.color}
                />
                <Text className="font-sans-medium text-foreground text-sm">
                  {provider.name === 'google' ? t.auth.google : t.auth.discord}
                </Text>
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export const OAuthButtons = memo(OAuthButtonsComponent)
