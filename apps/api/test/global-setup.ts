import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { E2E_DATABASE_URL } from './e2e-env.js';

/** Brings the e2e database (from docker-compose.yml) up to date before the run. */
export default async function setup(): Promise<void> {
  const db = drizzle({ connection: E2E_DATABASE_URL });
  try {
    await migrate(db, {
      migrationsFolder: `${import.meta.dirname}/../drizzle`,
    });
  } finally {
    await db.$client.end();
  }
}
