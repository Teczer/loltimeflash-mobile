import type { TierConfigs } from './types'

export const SCALE_FACTOR = 2
export const DEFAULT_BORDER_RADIUS = 12
export const DEFAULT_BORDER_WIDTH = 2
export const CARD_BACKGROUND_COLOR = '#191a22'

export const DEFAULT_WHEEL_COLORS: readonly string[] = [
  '#FFEB3B',
  '#FF9800',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#3F51B5',
  '#03A9F4',
  '#4CAF50',
]

export const TIER_CONFIGS: TierConfigs = {
  S_PLUS: {
    colors: [
      'transparent',
      'transparent',
      'transparent',
      '#FFFFFF',
      '#FFB8D8',
      '#FFFFFF',
      '#B8FFE8',
      '#FFFFFF',
      'transparent',
      'transparent',
      'transparent',
    ],
    positions: [0, 0.4, 0.5, 0.58, 0.66, 0.74, 0.82, 0.88, 0.92, 0.96, 1],
    duration: 3000,
    glowIntensity: 0.5,
    glowBlurRadius: 8,
    glowSpread: 0.7,
  },
  S: {
    colors: [
      'transparent',
      'transparent',
      '#7f1d1d',
      '#dc2626',
      '#ef4444',
      '#fca5a5',
      'transparent',
    ],
    positions: [0, 0.5, 0.65, 0.8, 0.9, 0.95, 1],
    duration: 2000,
    glowIntensity: 0.5,
    glowBlurRadius: 8,
    glowSpread: 0.6,
  },
  A: {
    color: '#F97316',
    duration: 1200,
    pulseSpread: [0, 3],
    pulseBlur: [2, 8],
  },
}
