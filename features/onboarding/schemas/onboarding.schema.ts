import { z } from 'zod'

export const pseudoSchema = z.object({
  pseudo: z
    .string()
    .min(2, 'Pseudo must be at least 2 characters')
    .max(20, 'Pseudo must be at most 20 characters'),
})

export type TPseudoForm = z.infer<typeof pseudoSchema>
