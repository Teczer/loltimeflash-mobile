import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * S+ Tier Iridescent Beam Effect
 *
 * The most premium effect with pearl/iridescent colors.
 */

// Pearl/iridescent white colors for S+ tier - visible holographic shimmer
const S_PLUS_COLORS = [
  '#FFFFFF', // Pure white
  '#B8D4FF', // Blue tint
  '#FFB8D8', // Pink tint
  '#FFFFFF', // Pure white
  '#B8FFE8', // Mint tint
  '#FFE0B8', // Peach tint
  '#D8B8FF', // Lavender tint
  '#FFFFFF', // Pure white
]

interface ISPlusTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const SPlusTierBeam = ({
  children,
  borderRadius = 12,
}: ISPlusTierBeamProps) => (
  <GlowingBorderCard
    colors={S_PLUS_COLORS}
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
