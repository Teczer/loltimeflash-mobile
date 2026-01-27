import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { colors } from '@/lib/colors'

interface IBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
}: IBottomSheetProps) => {
  const translateY = useSharedValue(300)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (isOpen) {
      translateY.value = withTiming(0, { duration: 250 })
      opacity.value = withTiming(1, { duration: 200 })
    } else {
      translateY.value = withTiming(300, { duration: 200 })
      opacity.value = withTiming(0, { duration: 150 })
    }
  }, [isOpen, translateY, opacity])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.6,
  }))

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const handleBackdropPress = () => {
    translateY.value = withTiming(300, { duration: 200 }, () => {
      runOnJS(onClose)()
    })
    opacity.value = withTiming(0, { duration: 150 })
  }

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black"
        >
          <Pressable className="flex-1" onPress={handleBackdropPress} />
        </Animated.View>

        <Animated.View
          style={sheetStyle}
          className="rounded-t-3xl border-t border-white/10 bg-[#1a1824] pb-8"
        >
          {/* Handle */}
          <View className="items-center py-3">
            <View className="h-1 w-12 rounded-full bg-white/20" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-white/10 px-5 pb-4">
            <Text className="text-lg font-bold text-white">{title}</Text>
            <Pressable
              onPress={onClose}
              className="size-8 items-center justify-center rounded-full active:bg-white/10"
            >
              <Ionicons name="close" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Content */}
          <View className="px-5 pt-4">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  )
}
