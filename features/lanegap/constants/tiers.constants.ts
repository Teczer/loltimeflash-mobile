import type { ILocalizedText } from '@/lib/i18n'

import type { TTier } from '../types/lanegap.types'

export const TIER_ORDER: readonly TTier[] = [
  'S+',
  'S',
  'A+',
  'A',
  'B+',
  'B',
  'B-',
  'C',
]

export const TIER_COLORS: Record<TTier, string> = {
  'S+': '#F8FAFC',
  S: '#DC2626',
  'A+': '#dc4126',
  A: '#F97316',
  'B+': '#1D4ED8',
  B: '#2563EB',
  'B-': '#3B82F6',
  C: '#6B7280',
}

export const TIER_LABELS: Record<TTier, ILocalizedText> = {
  'S+': { en: 'Perfect Counter', fr: 'Counter parfait' },
  S: { en: 'Hard Counter', fr: 'Hard counter' },
  'A+': { en: 'Strong Counter', fr: 'Counter fort' },
  A: { en: 'Counter', fr: 'Counter' },
  'B+': { en: 'Slight Advantage', fr: 'Léger avantage' },
  B: { en: 'Skill Matchup (50/50)', fr: 'Skill matchup (50/50)' },
  'B-': { en: 'Slight Disadvantage', fr: 'Léger désavantage' },
  C: { en: 'Avoid', fr: 'À éviter' },
}
