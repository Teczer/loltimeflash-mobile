import './global.css'

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'react-native-reanimated'

import { StyledGestureHandlerRootView } from '@/components/styled'
import { colors } from '@/lib/colors'
import { QueryProvider } from '@/providers/query-provider'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// Keep splash visible while loading fonts
SplashScreen.preventAutoHideAsync()

// Configure splash animation
SplashScreen.setOptions({
  duration: 500,
  fade: true,
})

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <StyledGestureHandlerRootView className="bg-background flex-1">
      <KeyboardProvider>
        <QueryProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen
              name="settings"
              options={{ fullScreenGestureEnabled: true }}
            />
            <Stack.Screen name="game/solo" />
            <Stack.Screen name="game/[roomId]" />
            <Stack.Screen
              name="lanegap/[championId]"
              options={{ fullScreenGestureEnabled: true }}
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </QueryProvider>
      </KeyboardProvider>
    </StyledGestureHandlerRootView>
  )
}
