import type {
  IFetchLiveGameResponse,
  TRiotRegion,
} from '@/features/game/types/riot.types'

import config from '@/lib/config'

/**
 * Fetch live game data from Riot API via NestJS backend
 */
export async function fetchLiveGameData(
  summonerName: string,
  region: TRiotRegion
): Promise<IFetchLiveGameResponse> {
  try {
    const response = await fetch(`${config.apiUrl}/riot/live-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summonerName,
        region,
      }),
    })

    const data: IFetchLiveGameResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching live game data:', error)
    return {
      success: false,
      error: 'Failed to fetch live game data',
    }
  }
}
