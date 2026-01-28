// =============================================================================
// Tiers
// =============================================================================

export type TTier = 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C'

export const TIER_ORDER: readonly TTier[] = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'B-', 'C'] as const

export const TIER_COLORS: Record<TTier, string> = {
  'S+': '#F8FAFC',
  S: '#DC2626',
  'A+': '#EA580C',
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

// =============================================================================
// Champion Data from PocketBase
// =============================================================================

export interface ILevelSpike {
  level: number
  text: string
  important?: boolean
}

export interface IItemSpike {
  itemId: string
  text: string
}

export interface IEnemyChampion {
  id: string
  name: string
  dateEdited: string
  tips: string[]
  levelSpikes: ILevelSpike[]
  itemSpikes: IItemSpike[]
  counters: { championId: string; tier: TTier }[]
}

// =============================================================================
// PocketBase Record Types
// =============================================================================

export interface IPBChampion {
  id: string
  champion_id: string
  name_en: string
  name_fr: string
  date_edited: string
  tips_en: string[]
  tips_fr: string[]
  created: string
  updated: string
}

export interface IPBLevelSpike {
  id: string
  champion: string
  level: number
  text_en: string
  text_fr: string
  important: boolean
}

export interface IPBItemSpike {
  id: string
  champion: string
  item_id: string
  text_en: string
  text_fr: string
}

export interface IPBCounter {
  id: string
  champion: string
  counter_champion: string
  tier: TTier
}
