import type { ReactNode } from 'react'

import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_BORDER_WIDTH,
  TIER_CONFIGS,
} from './constants'
import { GlowingBorderCard } from './glowing-border-card.component'

interface ISTierBeamProps {
  children: ReactNode
  borderRadius?: number
}

export const STierBeam = ({
  children,
  borderRadius = DEFAULT_BORDER_RADIUS,
}: ISTierBeamProps) => (
  <GlowingBorderCard
    colors={TIER_CONFIGS.S.colors}
    positions={TIER_CONFIGS.S.positions}
    duration={TIER_CONFIGS.S.duration}
    borderRadius={borderRadius}
    borderWidth={DEFAULT_BORDER_WIDTH}
    showGlow={true}
    glowIntensity={TIER_CONFIGS.S.glowIntensity}
    glowBlurRadius={TIER_CONFIGS.S.glowBlurRadius}
    glowSpread={TIER_CONFIGS.S.glowSpread}
  >
    {children}
  </GlowingBorderCard>
)
