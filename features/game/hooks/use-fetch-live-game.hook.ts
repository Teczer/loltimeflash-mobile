import { useMutation } from '@tanstack/react-query'
import { Alert } from 'react-native'

import { fetchLiveGameData } from '@/lib/riot-api.service'

import type {
  ILiveGameData,
  TRiotRegion,
} from '@/features/game/types/riot.types'

interface IFetchLiveGameParams {
  summonerName: string
  region: TRiotRegion
}

interface IUseFetchLiveGameOptions {
  onSuccess?: (data: ILiveGameData) => void
}

interface IUseFetchLiveGameReturn {
  mutate: (params: IFetchLiveGameParams) => void
  mutateAsync: (params: IFetchLiveGameParams) => Promise<ILiveGameData>
  isPending: boolean
}

export const useFetchLiveGame = (
  options?: IUseFetchLiveGameOptions
): IUseFetchLiveGameReturn => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ summonerName, region }: IFetchLiveGameParams) => {
      const response = await fetchLiveGameData(summonerName, region)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch live game data')
      }
      return response.data
    },
    onSuccess: (data) => {
      const enemyCount = data.enemies?.length || 0
      Alert.alert('Success', `Found ${enemyCount} enemy champions in live game`)
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Network error - please try again')
    },
  })

  return {
    mutate,
    mutateAsync,
    isPending,
  }
}
