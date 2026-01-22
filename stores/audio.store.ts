import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/mmkvStorage';

type TVolumeState = 'on' | 'off';

interface IAudioState {
  volume: TVolumeState;
}

interface IAudioActions {
  setVolume: (volume: TVolumeState) => void;
  toggleVolume: () => void;
}

const DEFAULT_STATE: IAudioState = {
  volume: 'on',
};

export const useAudioStore = create<IAudioState & IAudioActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      setVolume: (volume) => set({ volume }),
      toggleVolume: () => {
        const current = get().volume;
        set({ volume: current === 'on' ? 'off' : 'on' });
      },
    }),
    {
      name: 'audio-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
