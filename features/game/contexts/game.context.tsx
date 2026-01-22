import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useSocket } from '@/hooks/use-socket.hook';

import { DEFAULT_GAME_DATA, REACTION_TIME_COMPENSATION } from '../constants/game.constants';
import { useAudio } from '../hooks/use-audio.hook';
import { calculateFlashCooldown } from '../hooks/use-flash-cooldown.hook';
import { useGameTimer } from '../hooks/use-game-timer.hook';
import type { IChampionData, IGameData, TRole } from '../types/game.types';

interface IGameContextValue {
  gameState: IGameData;
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>;
  useFlash: (role: TRole) => void;
  cancelFlash: (role: TRole) => void;
  toggleItem: (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => void;
  adjustTimer: (role: TRole, adjustmentSeconds: number) => void;
  updateChampionData: (
    roleMapping: Partial<Record<TRole, IChampionData>>,
    gameInfo?: { gameId: number; gameStartTime: number }
  ) => void;
  audio: {
    play: () => Promise<void>;
    volume: 'on' | 'off';
    toggleVolume: () => void;
  };
  // Multiplayer state
  isConnected: boolean;
  isMultiplayer: boolean;
}

const GameContext = createContext<IGameContextValue | undefined>(undefined);

interface IGameProviderProps {
  children: React.ReactNode;
  initialState?: IGameData;
  // Multiplayer props
  roomId?: string;
  username?: string;
}

export const GameProvider = (props: IGameProviderProps) => {
  const { children, initialState = DEFAULT_GAME_DATA, roomId, username } = props;

  const isMultiplayer = Boolean(roomId && username);

  const [gameState, setGameState] = useState<IGameData>(initialState);
  const audio = useAudio();

  // Socket connection (only enabled in multiplayer mode)
  const socket = useSocket({
    enabled: isMultiplayer,
    roomId,
    username,
  });

  // Sync game state from socket
  useEffect(() => {
    if (socket.gameState) {
      setGameState(socket.gameState);
    }
  }, [socket.gameState]);

  // Timer countdown (checks for expired timers) - only in solo mode
  // In multiplayer, the server handles state
  useGameTimer({ gameState, setGameState, enabled: !isMultiplayer });

  // Trigger haptic feedback
  const triggerHaptic = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  // Use Flash for a role
  const useFlash = useCallback(
    (role: TRole) => {
      triggerHaptic();

      if (isMultiplayer) {
        // Multiplayer: emit to server
        socket.useFlash(role);
        audio.play();
      } else {
        // Solo: update local state
        setGameState((prev) => {
          const roleData = prev.roles[role];

          const cooldownSeconds = calculateFlashCooldown({
            lucidityBoots: roleData.lucidityBoots,
            cosmicInsight: roleData.cosmicInsight,
          });

          const adjustedCooldown = cooldownSeconds - REACTION_TIME_COMPENSATION;
          const endsAt = Date.now() + adjustedCooldown * 1000;

          return {
            ...prev,
            roles: {
              ...prev.roles,
              [role]: {
                ...roleData,
                isFlashed: endsAt,
              },
            },
          };
        });

        audio.play();
      }
    },
    [audio, triggerHaptic, isMultiplayer, socket]
  );

  // Cancel Flash cooldown
  const cancelFlash = useCallback(
    (role: TRole) => {
      triggerHaptic();

      if (isMultiplayer) {
        socket.cancelFlash(role);
      } else {
        setGameState((prev) => ({
          ...prev,
          roles: {
            ...prev.roles,
            [role]: {
              ...prev.roles[role],
              isFlashed: false,
            },
          },
        }));
      }
    },
    [triggerHaptic, isMultiplayer, socket]
  );

  // Toggle item (Boots or Rune)
  const toggleItem = useCallback(
    (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (isMultiplayer) {
        socket.toggleItem(role, item);
      } else {
        setGameState((prev) => {
          const roleData = prev.roles[role];
          const newItemValue = !roleData[item];

          let newFlashValue = roleData.isFlashed;
          if (typeof roleData.isFlashed === 'number') {
            const endsAt = roleData.isFlashed;
            const now = Date.now();
            const remainingMs = Math.max(0, endsAt - now);

            const oldMaxCooldown = calculateFlashCooldown({
              lucidityBoots: roleData.lucidityBoots,
              cosmicInsight: roleData.cosmicInsight,
            });

            const newMaxCooldown = calculateFlashCooldown({
              lucidityBoots: item === 'lucidityBoots' ? newItemValue : roleData.lucidityBoots,
              cosmicInsight: item === 'cosmicInsight' ? newItemValue : roleData.cosmicInsight,
            });

            const percentageRemaining = remainingMs / (oldMaxCooldown * 1000);
            const newRemainingMs = percentageRemaining * newMaxCooldown * 1000;
            newFlashValue = now + newRemainingMs;
          }

          return {
            ...prev,
            roles: {
              ...prev.roles,
              [role]: {
                ...roleData,
                [item]: newItemValue,
                isFlashed: newFlashValue,
              },
            },
          };
        });
      }
    },
    [isMultiplayer, socket]
  );

  // Adjust Flash timer manually
  const adjustTimer = useCallback(
    (role: TRole, adjustmentSeconds: number) => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (isMultiplayer) {
        socket.adjustTimer(role, adjustmentSeconds);
      } else {
        setGameState((prev) => {
          const roleData = prev.roles[role];

          if (typeof roleData.isFlashed === 'number') {
            const currentEndsAt = roleData.isFlashed;
            const newEndsAt = currentEndsAt + adjustmentSeconds * 1000;
            const adjustedEndsAt = Math.max(Date.now(), newEndsAt);

            return {
              ...prev,
              roles: {
                ...prev.roles,
                [role]: {
                  ...roleData,
                  isFlashed: adjustedEndsAt,
                },
              },
            };
          }

          return prev;
        });
      }
    },
    [isMultiplayer, socket]
  );

  // Update champion data from Riot API
  const updateChampionData = useCallback(
    (
      roleMapping: Partial<Record<TRole, IChampionData>>,
      gameInfo?: { gameId: number; gameStartTime: number }
    ) => {
      if (isMultiplayer) {
        socket.updateChampionData(roleMapping, gameInfo);
      } else {
        setGameState((prev) => {
          const newRoles = { ...prev.roles };

          for (const roleKey in roleMapping) {
            const role = roleKey as TRole;
            const championData = roleMapping[role];

            if (championData) {
              newRoles[role] = {
                ...newRoles[role],
                champion: {
                  championId: championData.championId,
                  championName: championData.championName,
                  championIconUrl: championData.championIconUrl,
                  summonerName: championData.summonerName,
                },
              };
            }
          }

          return {
            ...prev,
            roles: newRoles,
            ...(gameInfo && {
              gameId: gameInfo.gameId,
              gameStartTime: gameInfo.gameStartTime,
            }),
          };
        });
      }
    },
    [isMultiplayer, socket]
  );

  const value: IGameContextValue = {
    gameState,
    setGameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
    audio: {
      play: audio.play,
      volume: audio.volume,
      toggleVolume: audio.toggleVolume,
    },
    isConnected: socket.isConnected,
    isMultiplayer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * Hook to use Game context
 */
export const useGameContext = (): IGameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};
