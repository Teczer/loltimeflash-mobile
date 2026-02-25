/** App background blue (RGB 2, 16, 34) */
const HEADER_BLUE_R = 2
const HEADER_BLUE_G = 16
const HEADER_BLUE_B = 34

export const Colors = {
  black: '#021022',
  white: '#FFFFFF',
  gray: {
    400: '#A3A3A3',
  },
} as const

export const HEADER_HEIGHT = 56
export const MAX_BLUR_INTENSITY = 80

/** Header gradient opacity (top → bottom) */
export const HEADER_GRADIENT_OPACITY_TOP = 0.6
export const HEADER_GRADIENT_OPACITY_MID = 0.5

/** Mask gradient opacity (fade to solid) */
export const MASK_GRADIENT_OPACITY_MID = 0.99
export const MASK_GRADIENT_OPACITY_END = 1

/** Web fallback header opacity */
export const WEB_HEADER_OPACITY = 0.4

export const headerBackgroundGradientColors = [
  `rgba(${HEADER_BLUE_R}, ${HEADER_BLUE_G}, ${HEADER_BLUE_B}, ${HEADER_GRADIENT_OPACITY_TOP})`,
  `rgba(${HEADER_BLUE_R}, ${HEADER_BLUE_G}, ${HEADER_BLUE_B}, ${HEADER_GRADIENT_OPACITY_MID})`,
  'transparent',
] as const

export const maskGradientColors = {
  start: 'transparent',
  middle: `rgba(${HEADER_BLUE_R}, ${HEADER_BLUE_G}, ${HEADER_BLUE_B}, ${MASK_GRADIENT_OPACITY_MID})`,
  end: `rgba(${HEADER_BLUE_R}, ${HEADER_BLUE_G}, ${HEADER_BLUE_B}, ${MASK_GRADIENT_OPACITY_END})`,
} as const

export const webHeaderBackgroundColor = `rgba(${HEADER_BLUE_R}, ${HEADER_BLUE_G}, ${HEADER_BLUE_B}, ${WEB_HEADER_OPACITY})`

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const
