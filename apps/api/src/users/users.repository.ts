import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/** In-memory storage. Data is lost when the process restarts. */
@Injectable()
export class UsersRepository {
  private readonly users: UserRecord[] = [];

  create(data: Omit<UserRecord, 'id' | 'createdAt'>): UserRecord {
    const user: UserRecord = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.users.find((user) => user.email === email);
  }

  findById(id: string): UserRecord | undefined {
    return this.users.find((user) => user.id === id);
  }
}
