import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * S Tier Red Beam Effect
 *
 * A premium red beam effect for S tier counters.
 */

// Red colors for S tier
const S_COLORS = [
  '#DC2626', // Red-600
  '#991B1B', // Red-800
  '#EF4444', // Red-500
  '#B91C1C', // Red-700
  '#DC2626', // Red-600
  '#7F1D1D', // Red-900
  '#F87171', // Red-400
  '#DC2626', // Red-600
]

interface ISTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const STierBeam = ({ children, borderRadius = 12 }: ISTierBeamProps) => (
  <GlowingBorderCard
    colors={S_COLORS}
    duration={2000}
    borderRadius={borderRadius}
    borderWidth={3}
    showGlow={true}
    glowIntensity={0.8}
    glowBlurRadius={8}
    glowSpread={0.5}
  >
    {children}
  </GlowingBorderCard>
)
