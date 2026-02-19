import { Ionicons } from '@expo/vector-icons'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { memo, useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import LanegapLogo from '@/assets/images/lanegap.svg'
import { DynamicButton } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

interface IAvatarStepProps {
  onComplete: (uri: string | null) => void
  onSkip: () => void
  isLoading?: boolean
}

const AVATAR_SIZE = 160
const PLUS_SIZE = 44
const MAX_FILE_SIZE = 10 * 1024 * 1024

const AvatarStepComponent = (props: IAvatarStepProps) => {
  const { onComplete, onSkip, isLoading = false } = props
  const { t } = useTranslation()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const pickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert(t.game.error, 'Permission to access photos is required')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (result.canceled || !result.assets[0]) return

    const asset = result.assets[0]

    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
      Alert.alert(t.game.error, t.onboarding.imageTooLarge)
      return
    }

    setIsCompressing(true)
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1024, height: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      )
      setImageUri(manipulated.uri)
    } catch {
      Alert.alert(t.game.error, t.onboarding.invalidFormat)
    } finally {
      setIsCompressing(false)
    }
  }, [t])

  const handleComplete = useCallback(() => {
    onComplete(imageUri)
  }, [imageUri, onComplete])

  const busy = isLoading || isCompressing

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="relative flex-1 justify-center px-8"
    >
      <View className="top-1/12 absolute right-1/2 z-10">
        <LanegapLogo width={64} height={64} fill="#FFFFFF" />
      </View>
      <View className="gap-8">
        <View className="items-center gap-2">
          <Text className="text-foreground font-sans-bold text-2xl">
            {t.onboarding.chooseAvatar}
          </Text>
          <Text className="text-muted-foreground text-center font-sans text-base">
            {t.onboarding.avatarSubtitle}
          </Text>
        </View>

        <Pressable onPress={pickImage} disabled={busy} className="items-center">
          <View style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
            <View
              className="absolute items-center justify-center overflow-hidden rounded-full"
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: imageUri ? colors.gold : colors.border,
                backgroundColor: imageUri ? 'transparent' : colors.input,
              }}
            >
              {isCompressing ? (
                <ActivityIndicator size="large" color={colors.gold} />
              ) : imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={64}
                  color={colors.mutedForeground}
                />
              )}
            </View>
            {!imageUri && !isCompressing && (
              <View
                className="absolute items-center justify-center rounded-full"
                style={{
                  right: -4,
                  bottom: -4,
                  width: PLUS_SIZE,
                  height: PLUS_SIZE,
                  backgroundColor: colors.gold,
                }}
              >
                <Ionicons name="add" size={28} color={colors.background} />
              </View>
            )}
          </View>
        </Pressable>

        <View className="gap-4">
          <DynamicButton
            onPress={handleComplete}
            disabled={!imageUri || busy}
            isLoading={isLoading}
            loadingText={t.onboarding.letsGo}
          >
            {t.onboarding.letsGo}
          </DynamicButton>

          <Pressable onPress={onSkip} className="items-center py-2">
            <Text className="text-muted-foreground font-sans text-sm">
              {t.onboarding.skip}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  )
}

export const AvatarStep = memo(AvatarStepComponent)
