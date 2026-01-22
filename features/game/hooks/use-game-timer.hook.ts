import { useEffect } from 'react';
import type { IGameData, IRoleData } from '../types/game.types';

interface IUseGameTimerOptions {
  gameState: IGameData;
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>;
}

/**
 * Game timer hook
 * Checks for expired Flash timers and updates state when they expire
 *
 * Note: The actual countdown display is calculated dynamically using getRemainingTime()
 * This prevents time drift and ensures synchronization
 */
export const useGameTimer = (options: IUseGameTimerOptions): void => {
  const { setGameState } = options;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setGameState((prevState) => {
        const updatedRoles = { ...prevState.roles } as IRoleData;
        let hasChanges = false;

        // Check all active timers and update only expired ones
        for (const key in updatedRoles) {
          const roleKey = key as keyof IRoleData;
          const roleData = updatedRoles[roleKey];

          // If Flash is on cooldown (isFlashed is a timestamp)
          if (typeof roleData.isFlashed === 'number') {
            const endsAt = roleData.isFlashed;
            const remainingMs = endsAt - now;

            // If timer expired, set Flash to available
            if (remainingMs <= 0) {
              updatedRoles[roleKey] = {
                ...roleData,
                isFlashed: false,
              };
              hasChanges = true;
            }
          }
        }

        return hasChanges ? { ...prevState, roles: updatedRoles } : prevState;
      });
    }, 100); // Check every 100ms for smoother expiration detection

    return () => clearInterval(interval);
  }, [setGameState]);
};
