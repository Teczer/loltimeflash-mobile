import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * S Tier Red Beam Effect
 *
 * A premium red beam effect for S tier counters.
 */

// Red colors for S tier - 4 colors with high contrast
const S_COLORS = [
  '#FF4444', // Bright red
  '#8B0000', // Dark red
  '#FF6666', // Light red
  '#660000', // Very dark red
]

interface ISTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const STierBeam = ({ children, borderRadius = 12 }: ISTierBeamProps) => (
  <GlowingBorderCard
    colors={S_COLORS}
    duration={3000}
    borderRadius={borderRadius}
    borderWidth={1}
    showGlow={true}
    glowIntensity={0.7}
    glowBlurRadius={15}
    glowSpread={0.5}
  >
    {children}
  </GlowingBorderCard>
)
