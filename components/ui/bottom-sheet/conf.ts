import { Dimensions } from 'react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const SCREEN_HEIGHT_CONST = SCREEN_HEIGHT
export const HANDLE_HEIGHT = 28
export const SCROLL_TOP_THRESHOLD = 5
export const SNAP_VELOCITY_THRESHOLD = 500

export const DEFAULT_SPRING_CONFIG = {
  damping: 28,
  mass: 0.8,
  stiffness: 180,
}

export const DEFAULT_TIMING_CONFIG = {
  duration: 280,
}

export const OPEN_ANIMATION_DURATION = 350
