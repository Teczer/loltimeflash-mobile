import * as Haptics from 'expo-haptics'
import { memo, useEffect } from 'react'
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

type TVariant = 'primary' | 'default' | 'outline' | 'ghost' | 'destructive'
type TSize = 'sm' | 'default' | 'lg'

interface IDynamicButtonProps {
  children?: string
  variant?: TVariant
  size?: TSize
  icon?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  onPress?: () => void
  className?: string
  textClassName?: string
}

const VARIANT_COLORS: Record<
  TVariant,
  { bg: string; loadingBg: string; text: string }
> = {
  primary: {
    bg: 'rgba(196, 161, 91, 0.2)',
    loadingBg: 'rgba(196, 161, 91, 0.12)',
    text: colors.goldLight,
  },
  default: {
    bg: colors.primary,
    loadingBg: '#d4d4d4',
    text: colors.background,
  },
  outline: {
    bg: 'transparent',
    loadingBg: 'rgba(255,255,255,0.05)',
    text: colors.foreground,
  },
  ghost: {
    bg: 'transparent',
    loadingBg: 'rgba(255,255,255,0.05)',
    text: colors.foreground,
  },
  destructive: {
    bg: colors.destructive,
    loadingBg: '#6b1c1c',
    text: colors.foreground,
  },
}

const SIZE_STYLES: Record<TSize, ViewStyle> = {
  sm: { height: 40, paddingHorizontal: 14, borderRadius: 10 },
  default: { height: 48, paddingHorizontal: 20, borderRadius: 12 },
  lg: { height: 56, paddingHorizontal: 24, borderRadius: 14 },
}

const SIZE_FONT: Record<TSize, string> = {
  sm: 'text-sm',
  default: 'text-base',
  lg: 'text-lg',
}

const ANIMATION_DURATION = 250

const DynamicButtonComponent = (props: IDynamicButtonProps) => {
  const {
    children,
    variant = 'primary',
    size = 'default',
    icon,
    isLoading = false,
    loadingText,
    disabled = false,
    onPress,
    className,
    textClassName,
  } = props

  const variantColors = VARIANT_COLORS[variant]
  const sizeStyle = SIZE_STYLES[size]

  const animationProgress = useSharedValue(isLoading ? 1 : 0)
  const scaleValue = useSharedValue(1)

  useEffect(() => {
    animationProgress.value = withTiming(isLoading ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })
  }, [isLoading, animationProgress])

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationProgress.value, [0, 1], [0, -20])
    const opacity = interpolate(animationProgress.value, [0, 0.5], [1, 0])
    return { transform: [{ translateY }], opacity }
  })

  const loadingAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationProgress.value, [0, 1], [20, 0])
    const opacity = interpolate(animationProgress.value, [0.5, 1], [0, 1])
    return { transform: [{ translateY }], opacity }
  })

  const pressAnimatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [variantColors.bg, variantColors.loadingBg]
    )
    return {
      transform: [{ scale: scaleValue.value }],
      backgroundColor: bgColor,
    }
  })

  const handlePressIn = () => {
    if (!disabled && !isLoading) {
      scaleValue.value = withTiming(0.96, { duration: 100 })
    }
  }

  const handlePressOut = () => {
    if (!disabled && !isLoading) {
      scaleValue.value = withTiming(1, { duration: 200 })
    }
  }

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress?.()
  }

  const borderStyle =
    variant === 'outline'
      ? { borderWidth: 1, borderColor: colors.input }
      : undefined

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading || disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: isLoading || disabled }}
      className={className}
    >
      <Animated.View
        style={[
          styles.button,
          sizeStyle,
          borderStyle,
          pressAnimatedStyle,
          disabled && !isLoading && { opacity: 0.5 },
        ]}
      >
        <View style={styles.contentWrapper}>
          <Animated.View
            style={[styles.contentContainer, contentAnimatedStyle]}
          >
            <View className="flex-row items-center gap-2">
              {icon}
              {children && (
                <Text
                  className={cn(
                    'font-sans-bold text-center',
                    SIZE_FONT[size],
                    textClassName
                  )}
                  style={{ color: variantColors.text }}
                >
                  {children}
                </Text>
              )}
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.loadingContainer, loadingAnimatedStyle]}
          >
            <ActivityIndicator
              size="small"
              color={variantColors.text}
              style={{ marginRight: loadingText ? 8 : 0 }}
            />
            {loadingText && (
              <Text
                className={cn('font-sans-medium', SIZE_FONT[size])}
                style={{ color: variantColors.text }}
              >
                {loadingText}
              </Text>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  )
}

export const DynamicButton = memo(DynamicButtonComponent)

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
