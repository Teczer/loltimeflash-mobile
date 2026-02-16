import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * S+ Tier Iridescent Beam Effect
 *
 * A white/iridescent beam that rotates around the border with a trail effect.
 */

// Beam colors: transparent -> iridescent trail -> transparent (11 colors)
const S_PLUS_BEAM_COLORS = [
  'transparent',
  'transparent',
  '#FFFFFF', // Pure white
  '#B8D4FF', // Light blue
  '#FFB8D8', // Pink
  '#FFFFFF', // Pure white
  '#B8FFE8', // Mint
  '#FFE0B8', // Peach
  '#D8B8FF', // Lavender
  '#FFFFFF', // Pure white
  'transparent',
]

// Positions for 11 colors
const S_PLUS_BEAM_POSITIONS = [
  0, 0.4, 0.5, 0.58, 0.66, 0.74, 0.82, 0.88, 0.92, 0.96, 1,
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
    colors={S_PLUS_BEAM_COLORS}
    positions={S_PLUS_BEAM_POSITIONS}
    duration={2500}
    borderRadius={borderRadius}
    borderWidth={2}
    showGlow={true}
    glowIntensity={0.6}
    glowBlurRadius={12}
    glowSpread={0.6}
  >
    {children}
  </GlowingBorderCard>
)
