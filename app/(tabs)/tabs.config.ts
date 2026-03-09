export type TTabName = 'index' | 'multiplayer' | 'lanegap' | 'profile'

export interface ITabIconsConfig {
  fa: string
  sf: { default: string; selected: string }
  md: string
}

export interface ITabConfig {
  name: TTabName
  titleKey: 'solo' | 'multi' | 'laneGap' | 'profile'
  icon: 'user' | 'users' | 'lanegap' | 'profile'
  icons?: ITabIconsConfig
}

export const TABS_CONFIG = {
  INDEX: {
    name: 'index' as TTabName,
    titleKey: 'solo' as const,
    icon: 'user' as const,
    icons: {
      fa: 'user',
      sf: { default: 'person', selected: 'person.fill' },
      md: 'person',
    },
  },
  MULTIPLAYER: {
    name: 'multiplayer' as TTabName,
    titleKey: 'multi' as const,
    icon: 'users' as const,
    icons: {
      fa: 'users',
      sf: { default: 'person.2', selected: 'person.2.fill' },
      md: 'group',
    },
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
    icons: {
      fa: 'user-circle',
      sf: { default: 'person.crop.circle', selected: 'person.crop.circle.fill' },
      md: 'account-circle',
    },
  },
} as const satisfies Record<string, ITabConfig>
