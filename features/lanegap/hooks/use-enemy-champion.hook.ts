import { useQuery } from '@tanstack/react-query'

import { fetchEnemyChampion } from '@/features/lanegap/api'

export const useEnemyChampion = (championId: string) => {
  return useQuery({
    queryKey: ['enemyChampion', championId],
    queryFn: () => fetchEnemyChampion(championId),
    enabled: !!championId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
