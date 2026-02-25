import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useEffect, useMemo } from 'react'
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  DEFAULT_SPRING_CONFIG,
  DEFAULT_TIMING_CONFIG,
  OPEN_ANIMATION_DURATION,
  SCREEN_HEIGHT_CONST,
} from './conf'
import { sheetTheme } from './sheet-theme'
import type { IBottomSheetProps } from './types'
import { parseSnapPoint } from './utils'

const SNAP_POINTS_DEFAULT = ['50%', '90%']

const BottomSheetComponent = (props: IBottomSheetProps) => {
  const insets = useSafeAreaInsets()
  const {
    isOpen,
    onClose,
    title,
    children,
    snapPoints = SNAP_POINTS_DEFAULT,
    enableBackdrop = true,
    backdropOpacity = 0.6,
    dismissOnBackdropPress = true,
    dismissOnSwipeDown = true,
    showHandle = true,
    backgroundColor = sheetTheme.background,
    borderRadius = 24,
    disableScroll = false,
  } = props

  const parsedSnapPoints = useMemo(
    () => snapPoints.map(parseSnapPoint),
    [snapPoints]
  )
  const maxSnapPoint = Math.max(...parsedSnapPoints)
  const minSnapPoint = Math.min(...parsedSnapPoints)
  const maxSnapIndex = parsedSnapPoints.length - 1

  const translateY = useSharedValue(SCREEN_HEIGHT_CONST)
  const context = useSharedValue(0)
  const currentSnapIndex = useSharedValue(-1)

  const findClosestSnapPoint = useCallback(
    (currentY: number, velocity: number): number => {
      'worklet'
      const height = SCREEN_HEIGHT_CONST - currentY
      if (Math.abs(velocity) > 500) {
        const direction = velocity > 0 ? -1 : 1
        const nextIndex = currentSnapIndex.value + direction
        if (nextIndex >= 0 && nextIndex < parsedSnapPoints.length) {
          return nextIndex
        }
      }
      let closestIndex = 0
      let minDistance = Math.abs(height - parsedSnapPoints[0])
      for (let i = 1; i < parsedSnapPoints.length; i++) {
        const distance = Math.abs(height - parsedSnapPoints[i])
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = i
        }
      }
      return closestIndex
    },
    [parsedSnapPoints]
  )

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss()
  }, [])

  const closeSheet = useCallback(() => {
    'worklet'
    runOnJS(dismissKeyboard)()
    translateY.value = withTiming(
      SCREEN_HEIGHT_CONST,
      DEFAULT_TIMING_CONFIG,
      (finished) => {
        if (finished) {
          runOnJS(onClose)()
        }
      }
    )
  }, [onClose, translateY, dismissKeyboard])

  const snapToPoint = useCallback(
    (index: number, animated = true) => {
      'worklet'
      if (index < 0 || index >= parsedSnapPoints.length) return
      const targetY = SCREEN_HEIGHT_CONST - parsedSnapPoints[index]
      if (animated) {
        translateY.value = withSpring(targetY, DEFAULT_SPRING_CONFIG)
      } else {
        translateY.value = targetY
      }
      currentSnapIndex.value = index
    },
    [parsedSnapPoints, translateY, currentSnapIndex]
  )

  const handlePanGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          'worklet'
          context.value = translateY.value
        })
        .onUpdate((e) => {
          'worklet'
          const newY = context.value + e.translationY
          const minY = SCREEN_HEIGHT_CONST - maxSnapPoint
          const maxY = SCREEN_HEIGHT_CONST
          translateY.value = Math.max(minY, Math.min(maxY, newY))
        })
        .onEnd((e) => {
          'worklet'
          const currentY = translateY.value
          const velocity = e.velocityY
          if (
            dismissOnSwipeDown &&
            currentY > SCREEN_HEIGHT_CONST - minSnapPoint &&
            velocity > 500
          ) {
            closeSheet()
            return
          }
          const closestIndex = findClosestSnapPoint(currentY, velocity)
          snapToPoint(closestIndex, true)
        }),
    [
      translateY,
      context,
      maxSnapPoint,
      minSnapPoint,
      dismissOnSwipeDown,
      closeSheet,
      findClosestSnapPoint,
      snapToPoint,
    ]
  )

  useEffect(() => {
    if (isOpen) {
      currentSnapIndex.value = 0
      const targetY = SCREEN_HEIGHT_CONST - parsedSnapPoints[0]
      translateY.value = withTiming(targetY, {
        duration: OPEN_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    } else {
      translateY.value = SCREEN_HEIGHT_CONST
      currentSnapIndex.value = -1
    }
  }, [isOpen, parsedSnapPoints, translateY, currentSnapIndex])

  const handleBackdropPress = useCallback(() => {
    if (dismissOnBackdropPress) {
      closeSheet()
    } else {
      Keyboard.dismiss()
    }
  }, [dismissOnBackdropPress, closeSheet])

  useEffect(() => {
    if (!isOpen) return

    const keyboardDidShow = (e: { endCoordinates: { height: number } }) => {
      const keyboardHeight = e.endCoordinates.height
      const currentY = translateY.value
      const targetY = currentY - keyboardHeight
      const minY = SCREEN_HEIGHT_CONST - maxSnapPoint
      translateY.value = withTiming(
        Math.max(targetY, minY),
        { duration: 250 }
      )
    }

    const keyboardDidHide = () => {
      const index = currentSnapIndex.value
      if (index >= 0) {
        runOnUI(snapToPoint)(index, true)
      }
    }

    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardDidShow
    )
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardDidHide
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [
    isOpen,
    translateY,
    currentSnapIndex,
    maxSnapPoint,
    snapToPoint,
  ])

  const handleClosePress = useCallback(() => {
    closeSheet()
  }, [closeSheet])

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT_CONST - maxSnapPoint, SCREEN_HEIGHT_CONST],
      [backdropOpacity, 0],
      Extrapolation.CLAMP
    )
    return {
      opacity,
      pointerEvents: opacity > 0 ? ('auto' as const) : ('none' as const),
    }
  })

  if (!isOpen) return null

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.container} pointerEvents="box-none">
        {enableBackdrop && (
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleBackdropPress}
            />
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              boxShadow: sheetTheme.boxShadow,
            } as object,
            sheetStyle,
          ]}
        >
          {showHandle && (
            <GestureDetector gesture={handlePanGesture}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>
          )}

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={handleClosePress}
              style={styles.closeButton}
              hitSlop={12}
            >
              <Ionicons name="close" size={22} color={sheetTheme.icon} />
            </Pressable>
          </View>

          {disableScroll ? (
            <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
              {children}
            </View>
          ) : (
            <ScrollView
              style={styles.content}
              contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              bounces={false}
            >
              {children}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

export const BottomSheet = memo(BottomSheetComponent)

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: sheetTheme.backdrop,
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  handle: {
    backgroundColor: sheetTheme.handle,
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: sheetTheme.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  sheet: {
    borderTopColor: sheetTheme.border,
    borderTopWidth: 1,
    bottom: 0,
    height: Dimensions.get('window').height,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  title: {
    color: sheetTheme.text,
    fontSize: 18,
    fontWeight: '700',
  },
})
