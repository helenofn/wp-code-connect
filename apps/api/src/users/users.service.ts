import { ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from './password.js';
import type { CreateUserDto } from './user.schemas.js';
import type { UserResponse } from './user.response.js';
import { UsersRepository, type UserRecord } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create({ name, email, password }: CreateUserDto): Promise<UserRecord> {
    if (this.usersRepository.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await hashPassword(password);
    return this.usersRepository.create({ name, email, passwordHash });
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): UserRecord | undefined {
    return this.usersRepository.findById(id);
  }

  toResponse({ id, name, email, createdAt }: UserRecord): UserResponse {
    return { id, name, email, createdAt };
  }
}
