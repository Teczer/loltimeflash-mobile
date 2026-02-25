import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import * as Haptics from 'expo-haptics'
import { forwardRef, ReactNode } from 'react'
import { Platform, Pressable, PressableProps, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'

interface IGlassButtonProps extends PressableProps {
  children: ReactNode
  size?: number
  fallbackGlass?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const baseStyles = 'items-center justify-center border'
const glassStyles = {
  normal: 'bg-white/15 border-white/10',
  pressed: 'bg-white/30 border-white/20',
}

export const GlassButton = forwardRef<View, IGlassButtonProps>((props, ref) => {
  const {
    children,
    size = 44,
    fallbackGlass = true,
    style,
    onPress,
    ...pressableProps
  } = props

  const canUseGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const springConfig = { damping: 20, stiffness: 300, overshootClamping: true }

  const handlePressIn = () => {
    scale.value = withSpring(0.82, springConfig)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig)
  }

  const handlePress = (e: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress?.(e)
  }

  const buttonSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  }

  if (canUseGlass) {
    return (
      <AnimatedPressable
        ref={ref}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
        {...pressableProps}
      >
        <GlassView
          style={[
            buttonSize,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
          glassEffectStyle="regular"
          isInteractive
        >
          {children}
        </GlassView>
      </AnimatedPressable>
    )
  }

  if (fallbackGlass) {
    return (
      <AnimatedPressable
        ref={ref}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
        {...pressableProps}
      >
        {({ pressed }) => (
          <View
            className={cn(
              baseStyles,
              pressed ? glassStyles.pressed : glassStyles.normal
            )}
            style={buttonSize}
          >
            {children}
          </View>
        )}
      </AnimatedPressable>
    )
  }

  return (
    <AnimatedPressable
      ref={ref}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        buttonSize,
        { alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
      {...pressableProps}
    >
      {children}
    </AnimatedPressable>
  )
})

GlassButton.displayName = 'GlassButton'
