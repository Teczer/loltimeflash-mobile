import { memo, useEffect } from 'react'
import { View, type ViewProps } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'

interface ISkeletonProps extends ViewProps {
  className?: string
  /** Animation duration in ms (default: 1000) */
  duration?: number
}

const SkeletonComponent = (props: ISkeletonProps) => {
  const { className, duration = 1000, style, ...rest } = props
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration }), -1, true)
  }, [duration, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[animatedStyle, style]}
      className={cn('rounded-md bg-white/10', className)}
      {...rest}
    />
  )
}

export const Skeleton = memo(SkeletonComponent)

/**
 * Skeleton wrapper for sections - mimics SectionCard layout
 */
interface ISkeletonCardProps {
  children: React.ReactNode
  className?: string
}

const SkeletonCardComponent = (props: ISkeletonCardProps) => {
  const { children, className } = props

  return (
    <View
      className={cn(
        'bg-white/3 border-white/6 rounded-xl border p-4',
        className
      )}
    >
      {/* Header skeleton */}
      <View className="mb-3 flex-row items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </View>

      {/* Content */}
      {children}
    </View>
  )
}

export const SkeletonCard = memo(SkeletonCardComponent)
