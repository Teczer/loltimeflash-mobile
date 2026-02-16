import type { ILocalizedText } from '@/lib/i18n'

export type TTier = 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C'

export type TTierBase = 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C'

export interface ILevelSpike {
  level: number
  text: ILocalizedText
  important?: boolean
}

export interface IItemSpike {
  itemId: string
  text: ILocalizedText
}

export interface IEnemyChampion {
  id: string
  name: ILocalizedText
  dateEdited: string
  tips: { en: string[]; fr: string[] }
  levelSpikes: ILevelSpike[]
  itemSpikes: IItemSpike[]
  counters: { championId: string; tier: TTier }[]
}

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
