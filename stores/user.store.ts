import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/mmkvStorage';

interface IUserState {
  username: string | null;
}

interface IUserActions {
  setUsername: (username: string) => void;
  clearUsername: () => void;
}

const DEFAULT_STATE: IUserState = {
  username: null,
};

export const useUserStore = create<IUserState & IUserActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setUsername: (username) => set({ username }),
      clearUsername: () => set({ username: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
