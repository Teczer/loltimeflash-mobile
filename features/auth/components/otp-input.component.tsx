import * as Haptics from 'expo-haptics'
import { memo, useEffect, useRef } from 'react'
import { Platform, Text, View } from 'react-native'
import { OTPInput as NativeOTPInput, type SlotProps } from 'input-otp-native'
import type { OTPInputRef } from 'input-otp-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { colors } from '@/lib/colors'

const OTP_LENGTH = 6

interface IOTPInputProps {
  value: string
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  disabled?: boolean
  error?: boolean
}

function Slot({
  char,
  isActive,
  hasFakeCaret,
  index,
}: SlotProps & { index: number }) {
  const isFirst = index === 0
  const isLast = index === 2
  const scale = useSharedValue(1)
  const charOpacity = useSharedValue(char ? 1 : 0)

  useEffect(() => {
    if (char !== null) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 250 }),
      )
      charOpacity.value = withSpring(1, { damping: 15, stiffness: 150 })

      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } else {
      charOpacity.value = withTiming(0, { duration: 100 })
    }
  }, [char, scale, charOpacity])

  const animatedCharStyle = useAnimatedStyle(() => ({
    opacity: charOpacity.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <View
      className={cn(
        'h-14 w-12 items-center justify-center',
        'border',
        isFirst && 'rounded-l-xl',
        isLast && 'rounded-r-xl',
        isActive
          ? 'border-gold bg-white/5'
          : char
            ? 'border-gold/50 bg-white/[0.03]'
            : 'border-white/15 bg-white/[0.03]',
      )}
    >
      <Animated.View style={animatedCharStyle}>
        {char !== null && (
          <Text
            className="font-sans-bold text-2xl"
            style={{ color: colors.gold }}
          >
            {char}
          </Text>
        )}
      </Animated.View>
      {hasFakeCaret && <FakeCaret />}
    </View>
  )
}

function FakeDash() {
  return (
    <View className="w-6 items-center justify-center">
      <View
        className="h-0.5 w-2.5 rounded-sm"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      />
    </View>
  )
}

function FakeCaret() {
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View className="absolute h-full w-full items-center justify-center">
      <Animated.View
        style={[
          {
            width: 2,
            height: 28,
            backgroundColor: colors.gold,
            borderRadius: 1,
          },
          animatedStyle,
        ]}
      />
    </View>
  )
}

const OTPInputComponent = (props: IOTPInputProps) => {
  const { value, onChange, onComplete, disabled, error } = props
  const ref = useRef<OTPInputRef>(null)

  useEffect(() => {
    if (error && Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }, [error])

  useEffect(() => {
    if (error) {
      ref.current?.clear()
    }
  }, [error])

  const handleComplete = (code: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onComplete?.(code)
  }

  return (
    <NativeOTPInput
      ref={ref}
      value={value}
      onChange={onChange}
      onComplete={handleComplete}
      maxLength={OTP_LENGTH}
      editable={!disabled}
      render={({ slots }) => (
        <View className="flex-row items-center justify-center">
          <View className="flex-row">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
          <FakeDash />
          <View className="flex-row">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
        </View>
      )}
    />
  )
}

export const OTPInput = memo(OTPInputComponent)
