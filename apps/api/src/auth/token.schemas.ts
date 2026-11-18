import { z } from 'zod';

export const createTokenSchema = z
  .object({
    email: z.email().toLowerCase(),
    password: z.string().min(1),
  })
  .meta({ id: 'CreateTokenDto' });

export type CreateTokenDto = z.infer<typeof createTokenSchema>;
