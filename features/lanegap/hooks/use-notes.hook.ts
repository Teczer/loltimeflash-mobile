import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createNote,
  deleteNote,
  fetchEnemyNotes,
  updateNote,
} from '@/features/lanegap/api/notes.api'
import { useAuthStore } from '@/stores/auth.store'

export const useEnemyNotes = (championId: string) => {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['enemy-notes', user?.id, championId],
    queryFn: () => fetchEnemyNotes(user!.id, championId),
    enabled: !!user && !!championId,
  })
}

export const useCreateEnemyNote = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (data: { championId: string; content: string }) =>
      createNote({
        user: user!.id,
        champion_id: data.championId,
        content: data.content,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['enemy-notes', user?.id, variables.championId],
      })
    },
  })
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { noteId: string; content: string }) =>
      updateNote(data.noteId, data.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enemy-notes'] })
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enemy-notes'] })
    },
  })
}
