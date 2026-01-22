import { z } from 'zod';

import { LOBBY_CODE_LENGTH } from '@/features/game/constants/game.constants';

export const joinLobbySchema = z.object({
  lobbyCode: z
    .string()
    .min(1, 'Lobby code is required')
    .length(LOBBY_CODE_LENGTH, `Code must be ${LOBBY_CODE_LENGTH} characters`),
});

export type TJoinLobbyFormData = z.infer<typeof joinLobbySchema>;

export const createLobbySchema = z.object({
  lobbyCode: z.string().optional(),
});

export type TCreateLobbyFormData = z.infer<typeof createLobbySchema>;
