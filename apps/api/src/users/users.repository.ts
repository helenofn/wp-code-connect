import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import type { Database } from '../database/database.module.js';
import { uniqueViolation } from '../database/errors.js';
import { users } from '../database/schema.js';

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = Omit<typeof users.$inferInsert, 'id' | 'createdAt'>;

export const EMAIL_TAKEN = 'Email already registered';
export const USERNAME_TAKEN = 'Username already taken';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async create(data: NewUserRecord): Promise<UserRecord> {
    try {
      const [user] = await this.db.insert(users).values(data).returning();
      return user!;
    } catch (error) {
      // Covers the race between the service's checks and this insert.
      const constraint = uniqueViolation(error);
      if (constraint !== undefined) {
        throw new ConflictException(
          constraint.includes('username') ? USERNAME_TAKEN : EMAIL_TAKEN,
        );
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

  async findByUsername(username: string): Promise<UserRecord | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
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
