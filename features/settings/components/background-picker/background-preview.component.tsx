import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'

interface IBackgroundPreviewProps {
  image: ImageSourcePropType | null
  onPress: () => void
}

const BackgroundPreviewComponent = ({ image, onPress }: IBackgroundPreviewProps) => {
  const { t } = useTranslation()

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-lg border border-border"
    >
      {image && (
        <Image source={image} className="h-32 w-full" resizeMode="cover" />
      )}
      <View className="absolute inset-0 items-center justify-center bg-black/30">
        <Ionicons name="image-outline" size={32} color="white" />
        <Text className="mt-2 font-sans-bold text-sm text-white">
          {t.settings.changeBackground}
        </Text>
      </View>
    </Pressable>
  )
}

export const BackgroundPreview = memo(BackgroundPreviewComponent)
