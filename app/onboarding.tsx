import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackgroundImage } from '@/components/background-image.component'
import { GlassButton } from '@/components/ui'
import { AvatarStep } from '@/features/onboarding/components/avatar-step.component'
import { PseudoStep } from '@/features/onboarding/components/pseudo-step.component'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'

type TStep = 'pseudo' | 'avatar'

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const updateAvatar = useAuthStore((s) => s.updateAvatar)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [step, setStep] = useState<TStep>('pseudo')

  const handlePseudoContinue = async (pseudo: string) => {
    try {
      await updateProfile({ name: pseudo })
      setStep('avatar')
    } catch {
      Alert.alert(t.game.error)
    }
  }

  const handleAvatarComplete = async (uri: string | null) => {
    if (uri) {
      try {
        await updateAvatar(uri)
      } catch {
        Alert.alert(t.game.error)
      }
    }
    router.replace('/(tabs)/profile')
  }

  const handleBack = () => {
    if (step === 'avatar') {
      setStep('pseudo')
    } else {
      router.replace('/(tabs)/profile')
    }
  }

  return (
    <BackgroundImage variant="fast">
      <View
        className="flex-1 justify-center gap-y-20"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <GlassButton
          onPress={handleBack}
          fallbackGlass={false}
          className="absolute left-4 top-14 z-50"
        >
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color={colors.foreground}
          />
        </GlassButton>

        {step === 'pseudo' ? (
          <PseudoStep onContinue={handlePseudoContinue} isLoading={isLoading} />
        ) : (
          <AvatarStep
            onComplete={handleAvatarComplete}
            onSkip={() => router.replace('/(tabs)/profile')}
            isLoading={isLoading}
          />
        )}
      </View>
    </BackgroundImage>
  )
}
