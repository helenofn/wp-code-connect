import { z } from 'zod';

export const USERNAME_PATTERN = /^[a-z0-9_.]{3,30}$/;

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.email().toLowerCase(),
    username: z.string().trim().toLowerCase().regex(USERNAME_PATTERN, {
      error:
        'Username must be 3-30 characters: lowercase letters, numbers, "_" or "."',
    }),
    password: z.string().min(8),
  })
  .meta({ id: 'CreateUserDto' });

export type CreateUserDto = z.infer<typeof createUserSchema>;
