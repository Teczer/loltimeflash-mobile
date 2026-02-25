export type TTabName = 'index' | 'multiplayer' | 'lanegap' | 'profile'

export interface ITabConfig {
  name: TTabName
  titleKey: 'solo' | 'multi' | 'laneGap' | 'profile'
  icon: 'user' | 'users' | 'lanegap' | 'profile'
}

export const TABS_CONFIG = {
  INDEX: {
    name: 'index' as TTabName,
    titleKey: 'solo' as const,
    icon: 'user' as const,
  },
  MULTIPLAYER: {
    name: 'multiplayer' as TTabName,
    titleKey: 'multi' as const,
    icon: 'users' as const,
  },
  LANEGAP: {
    name: 'lanegap' as TTabName,
    titleKey: 'laneGap' as const,
    icon: 'lanegap' as const,
  },
  PROFILE: {
    name: 'profile' as TTabName,
    titleKey: 'profile' as const,
    icon: 'profile' as const,
  },
} as const satisfies Record<string, ITabConfig>
