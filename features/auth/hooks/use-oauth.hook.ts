import * as WebBrowser from 'expo-web-browser'
import { useCallback, useRef } from 'react'

import { pb } from '@/features/lanegap/lib/pocketbase'
import config from '@/lib/config'
import type { TOAuthProvider } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'

const WEB_CALLBACK_URL = `${config.lanegapWebUrl}/api/auth/mobile-callback`
const MOBILE_SCHEME = 'loltimeflash://oauth'

interface IOAuthProviderInfo {
  name: string
  state: string
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: string
  authURL: string
}

export const useOAuth = () => {
  const loginWithOAuth = useAuthStore((s) => s.loginWithOAuth)
  const setLoading = useAuthStore((s) => s.setLoading)
  const providerInfoRef = useRef<IOAuthProviderInfo | null>(null)

  const authenticate = useCallback(
    async (provider: TOAuthProvider) => {
      setLoading(true)
      try {
        const methods = await pb.collection('users').listAuthMethods()
        const providerInfo = methods.oauth2?.providers?.find(
          (p: IOAuthProviderInfo) => p.name === provider,
        )

        if (!providerInfo) {
          throw new Error(`Provider ${provider} not available`)
        }

        providerInfoRef.current = providerInfo

        const authUrl = new URL(providerInfo.authURL)
        authUrl.searchParams.set('redirect_uri', WEB_CALLBACK_URL)

        const result = await WebBrowser.openAuthSessionAsync(
          authUrl.toString(),
          MOBILE_SCHEME,
        )

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url)
          const code = url.searchParams.get('code')

          if (!code) {
            throw new Error('No code received')
          }

          await loginWithOAuth(
            provider,
            code,
            providerInfo.codeVerifier,
            WEB_CALLBACK_URL,
          )
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        throw error
      }
    },
    [loginWithOAuth, setLoading],
  )

  return { authenticate }
}
