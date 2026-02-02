/**
 * Riot API region codes
 */
export type TRiotRegion =
  | 'br1'
  | 'eun1'
  | 'euw1'
  | 'jp1'
  | 'kr'
  | 'la1'
  | 'la2'
  | 'me1'
  | 'na1'
  | 'oc1'
  | 'ph2'
  | 'ru'
  | 'sg2'
  | 'th2'
  | 'tr1'
  | 'tw2'
  | 'vn2'

/**
 * Riot API participant data
 */
export interface IRiotParticipant {
  teamId: number
  spell1Id: number
  spell2Id: number
  championId: number
  championIconUrl?: string
  summonerName?: string
  riotId?: string
}

/**
 * Live game data from backend
 */
export interface ILiveGameData {
  allies: IRiotParticipant[]
  enemies: IRiotParticipant[]
  gameId: number
  gameStartTime: number
  gameLength: number
}

/**
 * Fetch live game API response
 */
export interface IFetchLiveGameResponse {
  success: boolean
  data?: ILiveGameData
  error?: string
}

/**
 * Region options for select
 */
export interface IRegionOption {
  value: TRiotRegion
  label: string
}

/**
 * Available regions
 */
export const RIOT_REGIONS: IRegionOption[] = [
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'na1', label: 'NA' },
  { value: 'br1', label: 'BR' },
  { value: 'kr', label: 'KR' },
  { value: 'jp1', label: 'JP' },
  { value: 'la1', label: 'LAN' },
  { value: 'la2', label: 'LAS' },
  { value: 'oc1', label: 'OCE' },
  { value: 'ph2', label: 'PH' },
  { value: 'ru', label: 'RU' },
  { value: 'sg2', label: 'SG' },
  { value: 'th2', label: 'TH' },
  { value: 'tr1', label: 'TR' },
  { value: 'tw2', label: 'TW' },
  { value: 'vn2', label: 'VN' },
]
