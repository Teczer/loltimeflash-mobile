import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * S Tier Red Beam Effect
 *
 * A red beam that rotates around the border with a trail effect.
 * Matches the web version: transparent -> red trail -> transparent
 */

// Beam colors: transparent -> dark red -> red -> bright red -> pink -> transparent
const S_BEAM_COLORS = [
  'transparent',
  'transparent',
  '#7f1d1d', // Dark red
  '#dc2626', // Red
  '#ef4444', // Bright red
  '#fca5a5', // Light pink
  'transparent',
]

// Positions to create the beam trail effect
const S_BEAM_POSITIONS = [0, 0.5, 0.65, 0.8, 0.9, 0.95, 1]

interface ISTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const STierBeam = ({ children, borderRadius = 12 }: ISTierBeamProps) => (
  <GlowingBorderCard
    colors={S_BEAM_COLORS}
    positions={S_BEAM_POSITIONS}
    duration={2000}
    borderRadius={borderRadius}
    borderWidth={2}
    showGlow={true}
    glowIntensity={0.5}
    glowBlurRadius={8}
    glowSpread={0.6}
  >
    {children}
  </GlowingBorderCard>
)
