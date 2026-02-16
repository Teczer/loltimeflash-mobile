import type { ReactNode } from 'react'

import { GlowingBorderCard } from './glowing-border-card.component'

/**
 * A Tier Orange/Amber Glow Effect
 *
 * A warm, subtle effect for A tier counters.
 */

// Orange/amber colors for A tier
const A_COLORS = [
  '#F97316', // Orange-500
  '#EA580C', // Orange-600
  '#FB923C', // Orange-400
  '#C2410C', // Orange-700
  '#F97316', // Orange-500
  '#FDBA74', // Orange-300
  '#EA580C', // Orange-600
  '#F97316', // Orange-500
]

interface IATierGlowProps {
  children: ReactNode
  borderRadius?: number
}

export const ATierGlow = ({
  children,
  borderRadius = 12,
}: IATierGlowProps) => (
  <GlowingBorderCard
    colors={A_COLORS}
    duration={3000}
    borderRadius={borderRadius}
    borderWidth={2}
    showGlow={true}
    glowIntensity={0.5}
    glowBlurRadius={15}
    glowSpread={0.6}
  >
    {children}
  </GlowingBorderCard>
)
