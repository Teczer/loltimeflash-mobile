export type TierBeamConfig = {
  colors: readonly string[]
  positions: readonly number[]
  duration: number
  glowIntensity: number
  glowBlurRadius: number
  glowSpread: number
}

export type TierPulseConfig = {
  color: string
  duration: number
  pulseSpread: readonly [number, number]
  pulseBlur: readonly [number, number]
}

export type TierConfigs = {
  S_PLUS: TierBeamConfig
  S: TierBeamConfig
  A: TierPulseConfig
}
