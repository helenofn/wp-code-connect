import { defineConfig } from 'drizzle-kit';

// drizzle-kit loads `.env` from the directory it runs in (apps/api).
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
