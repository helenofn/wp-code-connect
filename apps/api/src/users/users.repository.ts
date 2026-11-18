import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import type { Database } from '../database/database.module.js';
import { users } from '../database/schema.js';

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = Omit<typeof users.$inferInsert, 'id' | 'createdAt'>;

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async create(data: NewUserRecord): Promise<UserRecord> {
    try {
      const [user] = await this.db.insert(users).values(data).returning();
      return user!;
    } catch (error) {
      // Covers the race between the service's email check and this insert.
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async findById(id: string): Promise<UserRecord | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }
}

/** Drizzle wraps driver errors, so the pg error may be the `cause`. */
function isUniqueViolation(error: unknown): boolean {
  for (let e = error; e instanceof Error; e = e.cause) {
    if ((e as { code?: unknown }).code === UNIQUE_VIOLATION) return true;
  }
  return false;
}
