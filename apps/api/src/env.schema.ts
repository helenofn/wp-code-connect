import { z } from 'zod';

export const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET must be set'),
  JWT_EXPIRES_IN: z.string().min(1).default('1h'),
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: 'DATABASE_URL must be a postgres:// connection string',
  }),
});

export type Env = z.infer<typeof envSchema>;
