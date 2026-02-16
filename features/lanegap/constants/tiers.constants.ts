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

export const TIER_LABELS: Record<TTier, string> = {
  'S+': 'Perfect Counter',
  S: 'Hard Counter',
  'A+': 'Strong Counter',
  A: 'Counter',
  'B+': 'Slight Advantage',
  B: 'Skill Matchup (50/50)',
  'B-': 'Slight Disadvantage',
  C: 'Avoid',
}
