import {
  StandardSchemaValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { getDrizzleToken } from '@nestjs/drizzle';
import { Test } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import type { Database } from './../src/database/database.module.js';
import { users } from './../src/database/schema.js';

/** Boots the app like main.ts does, on an empty database. */
export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.init();
  // Posts, likes and comments all cascade from users.
  await app
    .get<Database>(getDrizzleToken())
    .execute(sql`TRUNCATE ${users} CASCADE`);
  return app;
}

/** Signs up a user and returns an `Authorization` header value for them. */
export async function signUpAndLogin(
  app: INestApplication<App>,
  username: string,
): Promise<{ id: string; auth: string }> {
  const email = `${username}@example.com`;
  const password = 's3cret-pass';
  const { body: user } = await request(app.getHttpServer())
    .post('/users')
    .send({ name: username, email, username, password })
    .expect(201);
  const { body: token } = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);
  return { id: user.id, auth: `Bearer ${token.accessToken}` };
}
