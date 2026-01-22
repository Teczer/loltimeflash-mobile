import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

import config from '@/lib/config';
import type { IGameData, TRole, IChampionData } from '@/features/game/types/game.types';

/**
 * Socket event types (matching backend)
 */
interface IServerToClientEvents {
  'room:state': (state: IGameData) => void;
  'room:user:joined': (data: { username: string }) => void;
  'room:user:left': (data: { username: string }) => void;
  'game:flash': (data: { role: TRole; endsAt: number }) => void;
  'game:flash:cancel': (data: { role: TRole }) => void;
  'game:toggle:item': (data: { role: TRole; item: string; value: boolean }) => void;
  'game:champion:update': (data: { roleMapping: Partial<Record<TRole, IChampionData>> }) => void;
  error: (message: string) => void;
}

interface IClientToServerEvents {
  'room:join': (data: { roomId: string; username: string }) => void;
  'room:leave': (data: { roomId: string }) => void;
  'game:flash': (data: { role: TRole }) => void;
  'game:flash:cancel': (data: { role: TRole }) => void;
  'game:toggle:item': (data: { role: TRole; item: 'lucidityBoots' | 'cosmicInsight' }) => void;
  'game:flash:adjust': (data: { role: TRole; adjustmentSeconds: number }) => void;
  'game:champion:update': (data: {
    roleMapping: Partial<Record<TRole, IChampionData>>;
    gameInfo?: { gameId: number; gameStartTime: number };
  }) => void;
}

type TTypedSocket = Socket<IServerToClientEvents, IClientToServerEvents>;

interface IUseSocketOptions {
  enabled?: boolean;
  roomId?: string;
  username?: string;
}

interface IUseSocketReturn {
  socket: TTypedSocket | null;
  isConnected: boolean;
  reconnectAttempts: number;
  gameState: IGameData | null;
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: (roomId: string) => void;
  useFlash: (role: TRole) => void;
  cancelFlash: (role: TRole) => void;
  toggleItem: (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => void;
  adjustTimer: (role: TRole, adjustmentSeconds: number) => void;
  updateChampionData: (
    roleMapping: Partial<Record<TRole, IChampionData>>,
    gameInfo?: { gameId: number; gameStartTime: number }
  ) => void;
}

export const useSocket = (options: IUseSocketOptions = {}): IUseSocketReturn => {
  const { enabled = false, roomId, username } = options;

  const socketRef = useRef<TTypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [gameState, setGameState] = useState<IGameData | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!enabled) return;

    const socket: TTypedSocket = io(config.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to backend:', socket.id);
      setIsConnected(true);
      setReconnectAttempts(0);
    });

    socket.on('disconnect', (reason) => {
      console.warn('❌ Disconnected from backend:', reason);
      setIsConnected(false);
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}...`);
      setReconnectAttempts(attempt);
    });

    socket.io.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after max attempts');
    });

    // Game events
    socket.on('room:state', (updatedGameState) => {
      console.log('🔄 Room state updated:', updatedGameState);
      setGameState(updatedGameState);
    });

    socket.on('game:flash', (flashData) => {
      console.log('⚡ Flash used:', flashData);
    });

    socket.on('game:flash:cancel', (cancelData) => {
      console.log('❌ Flash cancelled:', cancelData);
    });

    socket.on('game:toggle:item', (itemData) => {
      console.log('🔧 Item toggled:', itemData);
    });

    socket.on('room:user:joined', (data) => {
      console.log('👤 User joined:', data.username);
    });

    socket.on('room:user:left', (data) => {
      console.log('👋 User left:', data.username);
    });

    socket.on('game:champion:update', (data) => {
      console.log('🎮 Champion data updated:', data);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    return () => {
      console.log('🔌 Cleaning up socket connection');
      socket.disconnect();
    };
  }, [enabled]);

  // Auto-join room when connected
  useEffect(() => {
    if (isConnected && roomId && username && socketRef.current) {
      console.log(`🚪 Auto-joining room: ${roomId} as ${username}`);
      socketRef.current.emit('room:join', { roomId, username });
    }
  }, [isConnected, roomId, username]);

  const joinRoom = useCallback((roomId: string, username: string): void => {
    if (socketRef.current) {
      socketRef.current.emit('room:join', { roomId, username });
    }
  }, []);

  const leaveRoom = useCallback((roomId: string): void => {
    if (socketRef.current) {
      socketRef.current.emit('room:leave', { roomId });
    }
  }, []);

  const useFlash = useCallback((role: TRole): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:flash', { role });
    }
  }, []);

  const cancelFlash = useCallback((role: TRole): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:flash:cancel', { role });
    }
  }, []);

  const toggleItem = useCallback(
    (role: TRole, item: 'lucidityBoots' | 'cosmicInsight'): void => {
      if (socketRef.current) {
        socketRef.current.emit('game:toggle:item', { role, item });
      }
    },
    []
  );

  const adjustTimer = useCallback((role: TRole, adjustmentSeconds: number): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:flash:adjust', { role, adjustmentSeconds });
    }
  }, []);

  const updateChampionData = useCallback(
    (
      roleMapping: Partial<Record<TRole, IChampionData>>,
      gameInfo?: { gameId: number; gameStartTime: number }
    ): void => {
      if (socketRef.current) {
        socketRef.current.emit('game:champion:update', { roleMapping, gameInfo });
      }
    },
    []
  );

  return {
    socket: socketRef.current,
    isConnected,
    reconnectAttempts,
    gameState,
    joinRoom,
    leaveRoom,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
  };
};
