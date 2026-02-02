import type { IGameData, ILeagueRole, ISummonerData } from '../types/game.types'

/**
 * Flash cooldown durations in seconds
 */
export const FLASH_BASE_COOLDOWN = 300 // 5 minutes
export const FLASH_COOLDOWN_WITH_BOOTS = 268 // 4:28

/**
 * Reaction time compensation (applied when Flash is used)
 */
export const REACTION_TIME_COMPENSATION = 3 // seconds

/**
 * League of Legends roles with icons
 * Icons are stored locally in assets
 */
export const LEAGUE_ROLES: ILeagueRole[] = [
  {
    name: 'TOP',
    icon: 'toprole',
  },
  {
    name: 'JUNGLE',
    icon: 'junglerole',
  },
  {
    name: 'MID',
    icon: 'midrole',
  },
  {
    name: 'ADC',
    icon: 'adcrole',
  },
  {
    name: 'SUPPORT',
    icon: 'supportrole',
  },
]

/**
 * Default summoner data (Flash available, no items)
 */
export const DEFAULT_SUMMONER_DATA: ISummonerData = {
  isFlashed: false,
  lucidityBoots: false,
}

/**
 * Default game data (empty users, all roles with default data)
 */
export const DEFAULT_GAME_DATA: IGameData = {
  users: [],
  roles: {
    TOP: { ...DEFAULT_SUMMONER_DATA },
    JUNGLE: { ...DEFAULT_SUMMONER_DATA },
    MID: { ...DEFAULT_SUMMONER_DATA },
    SUPPORT: { ...DEFAULT_SUMMONER_DATA },
    ADC: { ...DEFAULT_SUMMONER_DATA },
  },
}

/**
 * Audio volume level (0-1)
 */
export const AUDIO_VOLUME = 0.15

/**
 * Lobby code length
 */
export const LOBBY_CODE_LENGTH = 10

/**
 * Item icons (local assets)
 */
export const ITEM_ICONS = {
  lucidityBoots: require('@/assets/images/roles/lucidity-boots.png'),
} as const
