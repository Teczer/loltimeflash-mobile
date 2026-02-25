import type { ColorValue } from 'react-native'

export interface IGradientConfig {
  colors: [ColorValue, ColorValue, ColorValue]
  locations?: [number, number, number] | null
  start?: { x: number; y: number }
  end?: { x: number; y: number }
}

export interface IMaskGradientColors {
  start: string
  middle: string
  end: string
}

export interface IAnimatedHeaderProps {
  largeTitle?: string
  subtitle?: string
  children: React.ReactNode
  rightComponent?: React.ReactNode
  /** When true: no title/subtitle, only rightComponent visible from start, blends into blur on scroll */
  headerOnly?: boolean
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: object
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive'
  headerBackgroundGradient?: IGradientConfig
  headerBlurConfig?: { intensity: number; tint: string }
  smallTitleBlurIntensity?: number
  smallTitleBlurTint?: string
  maskGradientColors?: IMaskGradientColors
  largeTitleBlurIntensity?: number
  largeHeaderTitleStyle?: object
  largeHeaderSubtitleStyle?: object
  smallHeaderTitleStyle?: object
  smallHeaderSubtitleStyle?: object
}
