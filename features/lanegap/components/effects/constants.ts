import { TIER_COLORS } from '../../constants'
import type { TierConfigs } from './types'

export const SCALE_FACTOR = 2
export const DEFAULT_BORDER_RADIUS = 12
export const DEFAULT_BORDER_WIDTH = 2
export const CARD_BACKGROUND_COLOR = '#191a22'

export const TIER_CONFIGS: TierConfigs = {
  S_PLUS: {
    colors: [
      'transparent',
      'transparent',
      'transparent',
      '#826673',
      '#CDA2C7',
      '#ECEEED',
      '#A8A2C6',
      '#B896A6',
      'transparent',
      'transparent',
      'transparent',
    ],
    positions: [0, 0.45, 0.55, 0.62, 0.7, 0.78, 0.84, 0.9, 0.95, 0.98, 1],
    duration: 3000,
    glowIntensity: 0.6,
    glowBlurRadius: 10,
    glowSpread: 0.7,
  },
  S: {
    colors: [
      'transparent',
      'transparent',
      '#7f1d1d',
      TIER_COLORS.S,
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
  A_PLUS: {
    color: TIER_COLORS['A+'],
    duration: 1000,
    pulseSpread: [0, 4],
    pulseBlur: [3, 10],
  },
  A: {
    color: TIER_COLORS.A,
    duration: 1200,
    pulseSpread: [0, 3],
    pulseBlur: [2, 8],
  },
}
