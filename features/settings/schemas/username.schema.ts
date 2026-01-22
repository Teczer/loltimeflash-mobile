import { z } from 'zod';

import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/constants';

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username cannot be empty')
    .min(MIN_USERNAME_LENGTH)
    .max(MAX_USERNAME_LENGTH)
    .transform((val) => val.trim()),
});

export type TUsernameFormData = z.infer<typeof usernameSchema>;
