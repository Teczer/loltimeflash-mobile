import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { mmkvStorage } from '@/lib/mmkvStorage'

interface ILaneGapState {
  favoriteChampions: string[]
  recentChampions: string[]
}

interface ILaneGapActions {
  addFavorite: (championName: string) => void
  removeFavorite: (championName: string) => void
  toggleFavorite: (championName: string) => void
  addRecent: (championName: string) => void
  clearRecents: () => void
}

const MAX_RECENTS = 10

const DEFAULT_STATE: ILaneGapState = {
  favoriteChampions: [],
  recentChampions: [],
}

export const useLaneGapStore = create<ILaneGapState & ILaneGapActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      addFavorite: (championName) =>
        set((state) => ({
          favoriteChampions: state.favoriteChampions.includes(championName)
            ? state.favoriteChampions
            : [...state.favoriteChampions, championName],
        })),

      removeFavorite: (championName) =>
        set((state) => ({
          favoriteChampions: state.favoriteChampions.filter((c) => c !== championName),
        })),

      toggleFavorite: (championName) => {
        const { favoriteChampions } = get()
        if (favoriteChampions.includes(championName)) {
          set({ favoriteChampions: favoriteChampions.filter((c) => c !== championName) })
        } else {
          set({ favoriteChampions: [...favoriteChampions, championName] })
        }
      },

      addRecent: (championName) =>
        set((state) => {
          const filtered = state.recentChampions.filter((c) => c !== championName)
          return {
            recentChampions: [championName, ...filtered].slice(0, MAX_RECENTS),
          }
        }),

      clearRecents: () => set({ recentChampions: [] }),
    }),
    {
      name: 'lanegap-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
