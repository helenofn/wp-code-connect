import { ConflictException } from '@nestjs/common';
import { getDrizzleToken } from '@nestjs/drizzle';
import { Test, TestingModule } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { AppModule } from './../src/app.module.js';
import type { Database } from './../src/database/database.module.js';
import { users } from './../src/database/schema.js';
import { UsersRepository } from './../src/users/users.repository.js';

describe('UsersRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let repository: UsersRepository;

  const data = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hash',
  };

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    await moduleFixture.init();
    repository = moduleFixture.get(UsersRepository);
    await moduleFixture
      .get<Database>(getDrizzleToken())
      .execute(sql`TRUNCATE ${users}`);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('persists a user and finds it by id and email', async () => {
    const user = await repository.create(data);

    expect(user).toEqual({
      ...data,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
    await expect(repository.findById(user.id)).resolves.toEqual(user);
    await expect(repository.findByEmail(data.email)).resolves.toEqual(user);
  });

  it('returns undefined for a missing user', async () => {
    await expect(
      repository.findById('00000000-0000-0000-0000-000000000000'),
    ).resolves.toBeUndefined();
    await expect(
      repository.findByEmail('nobody@example.com'),
    ).resolves.toBeUndefined();
  });

  it('turns a duplicate email into a 409 at the database level', async () => {
    await repository.create(data);

    await expect(repository.create(data)).rejects.toThrow(
      new ConflictException('Email already registered'),
    );
  });
});
