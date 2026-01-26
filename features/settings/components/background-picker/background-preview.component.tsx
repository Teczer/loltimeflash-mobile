import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native'

interface IBackgroundPreviewProps {
  image: ImageSourcePropType | null
  onPress: () => void
}

const BackgroundPreviewComponent = ({ image, onPress }: IBackgroundPreviewProps) => (
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
        Change Background
      </Text>
    </View>
  </Pressable>
)

export const BackgroundPreview = memo(BackgroundPreviewComponent)
