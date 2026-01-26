import { memo } from 'react'
import { Image, Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'

import { colors } from '@/lib/colors'

import { LANE_ICONS, LANES, type TLane } from '../data'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface ILaneFilterProps {
  selectedLane: TLane
  onSelectLane: (lane: TLane) => void
}

interface ILaneButtonProps {
  lane: TLane
  isSelected: boolean
  onPress: () => void
}

const LaneButton = memo(({ lane, isSelected, onPress }: ILaneButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isSelected ? 1.2 : 1, {
          stiffness: 300,
          damping: 20,
        }),
      },
    ],
    opacity: withSpring(isSelected ? 1 : 0.35, {
      stiffness: 300,
      damping: 20,
    }),
  }))

  return (
    <AnimatedPressable
      onPress={onPress}
      className="relative size-14 items-center justify-center"
      style={animatedStyle}
    >
      <Image
        source={LANE_ICONS[lane]}
        className="size-12"
        resizeMode="contain"
      />
      {isSelected && (
        <View
          className="absolute -bottom-2 h-0.5 w-8 rounded-full"
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
  <View className="mb-6 flex-row items-center justify-center gap-4">
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
