import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ImageSourcePropType } from 'react-native';

import { mmkvStorage } from '@/lib/mmkvStorage';
import { getChampion, DEFAULT_CHAMPION } from '@/assets/champions';

interface IBackgroundState {
  championName: string;
  skinIndex: number;
}

interface IBackgroundActions {
  setBackground: (championName: string, skinIndex: number) => void;
  reset: () => void;
}

const DEFAULT_STATE: IBackgroundState = {
  championName: DEFAULT_CHAMPION,
  skinIndex: 0,
};

export const useBackgroundStore = create<IBackgroundState & IBackgroundActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setBackground: (championName, skinIndex) => set({ championName, skinIndex }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'background-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// Helper hook to get the actual image source
export const useBackgroundImage = (): ImageSourcePropType | null => {
  const { championName, skinIndex } = useBackgroundStore();
  const champion = getChampion(championName);
  
  if (!champion) return null;
  
  const skin = champion.skins.find((s) => s.index === skinIndex);
  return skin?.source || champion.skins[0]?.source || null;
};
