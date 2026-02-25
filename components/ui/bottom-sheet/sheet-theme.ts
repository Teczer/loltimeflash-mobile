/**
 * Design system for sheet components (BottomSheet, modals, etc.)
 * Dark blue palette matching app background (#021022).
 */
export const sheetTheme = {
  /** Sheet background - darker blue, elevated surface */
  background: 'rgba(2, 16, 30, 1)',
  /** Backdrop overlay - blue-tinted dark */
  backdrop: 'rgba(2, 0, 0, 1)',
  /** Border between sheet and backdrop */
  border: 'rgba(255, 255, 255, 0.08)',
  /** Handle bar */
  handle: 'rgba(255, 255, 255, 0.5)',
  /** Title and primary text */
  text: '#f5f5f7',
  /** Secondary/muted text */
  textMuted: '#8e8e93',
  /** Close icon */
  icon: '#f5f5f7',
  /** Card variant for centered modals (delete confirm, etc.) */
  cardBackground: '#030d1a',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  /** boxShadow for sheet elevation - must be array for RN iteration */
  boxShadow: [
    {
      offsetX: 0,
      offsetY: -4,
      blurRadius: 24,
      spreadDistance: 0,
      color: 'rgba(0, 0, 0, 0.4)',
    },
  ],
} as const
