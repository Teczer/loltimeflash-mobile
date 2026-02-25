import { ImageSourcePropType } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_CHAMPION,
  DEFAULT_SKIN_INDEX,
  getChampion,
} from '@/assets/champions'
import { mmkvStorage } from '@/lib/mmkvStorage'

interface IBackgroundState {
  championName: string
  skinIndex: number
}

interface IBackgroundActions {
  setBackground: (championName: string, skinIndex: number) => void
}

const DEFAULT_STATE: IBackgroundState = {
  championName: DEFAULT_CHAMPION,
  skinIndex: DEFAULT_SKIN_INDEX,
}

export const useBackgroundStore = create<
  IBackgroundState & IBackgroundActions
>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setBackground: (championName, skinIndex) =>
        set({ championName, skinIndex }),
    }),
    {
      name: 'background-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)

// Helper hook to get the actual image source
export const useBackgroundImage = (): ImageSourcePropType | null => {
  const { championName, skinIndex } = useBackgroundStore()
  const champion = getChampion(championName)

  if (!champion) return null

  const skin = champion.skins.find((s) => s.index === skinIndex)
  return skin?.source || champion.skins[0]?.source || null
}
