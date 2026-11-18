import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.email().toLowerCase(),
    password: z.string().min(8),
  })
  .meta({ id: 'CreateUserDto' });

export type CreateUserDto = z.infer<typeof createUserSchema>;
