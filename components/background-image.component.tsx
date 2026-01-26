import { LinearGradient } from 'expo-linear-gradient'
import { memo } from 'react'
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native'

import { DEFAULT_SPLASH } from '@/assets/champions'
import { useBackgroundImage } from '@/stores/background.store'

type TGradientVariant = 'default' | 'subtle' | 'fast' | 'ultrafast' | 'none'

interface IGradientConfig {
  colors: readonly [string, string, ...string[]]
  locations: readonly [number, number, ...number[]]
}

const GRADIENT_VARIANTS: Record<TGradientVariant, IGradientConfig | null> = {
  // Default - balanced fade for main screens
  default: {
    colors: [
      'rgba(12, 59, 106, 0.3)',
      'rgba(3, 16, 30, 0.75)',
      'rgba(3, 16, 30, 0.80)',
      'rgba(3, 16, 30, 1)',
    ],
    locations: [0, 0.2, 0.4, 0.7],
  },
  // Subtle - more visible background, lighter overlay
  subtle: {
    colors: [
      'rgba(12, 59, 106, 0.15)',
      'rgba(3, 16, 30, 0.4)',
      'rgba(3, 16, 30, 0.6)',
      'rgba(3, 16, 30, 0.85)',
    ],
    locations: [0, 0.3, 0.5, 0.8],
  },
  // Fast - quick fade for detail pages
  fast: {
    colors: [
      'rgba(2, 16, 34, 0.5)',
      'rgba(2, 16, 34, 0.85)',
      'rgba(2, 16, 34, 0.95)',
      'rgba(2, 16, 34, 1)',
    ],
    locations: [0, 0.15, 0.35, 0.55],
  },
  // Ultrafast - very quick fade, content-heavy pages
  ultrafast: {
    colors: [
      'rgba(2, 16, 34, 0.6)',
      'rgba(2, 16, 34, 0.9)',
      'rgba(2, 16, 34, 1)',
    ],
    locations: [0, 0.1, 0.3],
  },
  // None - no gradient, just the image
  none: null,
}

interface IBackgroundImageProps {
  children: React.ReactNode
  variant?: TGradientVariant
  source?: ImageSourcePropType
}

const BackgroundImageComponent = (props: IBackgroundImageProps) => {
  const { children, variant = 'default', source } = props
  const storeImage = useBackgroundImage()
  const imageSource = source || storeImage || DEFAULT_SPLASH

  const gradientConfig = GRADIENT_VARIANTS[variant]

  return (
    <ImageBackground
      resizeMode="cover"
      source={imageSource}
      className="h-full w-full flex-1"
    >
      {/* Gradient overlay */}
      {gradientConfig && (
        <LinearGradient
          colors={gradientConfig.colors}
          locations={gradientConfig.locations}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Content */}
      <View className="flex-1">{children}</View>
    </ImageBackground>
  )
}

export const BackgroundImage = memo(BackgroundImageComponent)
