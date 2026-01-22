/**
 * LolTimeFlash Colors
 * Simple color constants - no theming needed
 */
export const colors = {
  // Core
  background: '#021022',
  foreground: '#EEEFF0',
  
  // Cards
  card: '#232225',
  cardForeground: '#000000',
  
  // Primary (white text for flash UI)
  primary: '#FAFAFA',
  
  // LaneGap gold (LoL theme)
  gold: '#C4A15B',
  goldLight: '#EDDC91',
  
  // Secondary (olive)
  secondary: '#767E73',
  
  // Muted
  muted: '#F5F5F5',
  mutedForeground: '#A3A3A3',
  
  // Accent (gold/bronze)
  border: '#C4A15B',
  
  // Inputs
  input: '#46434D',
  ring: '#5F5A67',
  
  // Status
  success: '#22C55E',
  destructive: '#812525',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export type TColorKey = keyof typeof colors;
