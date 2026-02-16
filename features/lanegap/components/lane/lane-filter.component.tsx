import { memo } from 'react'
import { Image, Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { colors } from '@/lib/colors'

import { LANE_ICONS, LANES, type TLane } from '@/features/lanegap/data'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedImage = Animated.createAnimatedComponent(Image)

interface ILaneFilterProps {
  selectedLane: TLane
  onSelectLane: (lane: TLane) => void
}

interface ILaneButtonProps {
  lane: TLane
  isSelected: boolean
  onPress: () => void
}

const TIMING_CONFIG = { duration: 200 }

const LaneButton = memo(({ lane, isSelected, onPress }: ILaneButtonProps) => {
  const containerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0.3, TIMING_CONFIG),
  }))

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isSelected ? 1.15 : 0.9, TIMING_CONFIG),
      },
    ],
  }))

  return (
    <AnimatedPressable
      onPress={onPress}
      className="relative items-center justify-center"
      style={containerStyle}
    >
      <AnimatedImage
        source={LANE_ICONS[lane]}
        className="size-14"
        resizeMode="contain"
        style={imageStyle}
      />
      {isSelected && (
        <View
          className="absolute -bottom-2 h-0.5 w-2/3 rounded-full"
          style={{ backgroundColor: colors.gold }}
        />
      )}
    </AnimatedPressable>
  )
})

LaneButton.displayName = 'LaneButton'

const LaneFilterComponent = ({
  selectedLane,
  onSelectLane,
}: ILaneFilterProps) => (
  <View className="flex-row items-center justify-center gap-2">
    {LANES.map((lane) => (
      <LaneButton
        key={lane}
        lane={lane}
        isSelected={selectedLane === lane}
        onPress={() => onSelectLane(lane)}
      />
    ))}
  </View>
)

export const LaneFilter = memo(LaneFilterComponent)
