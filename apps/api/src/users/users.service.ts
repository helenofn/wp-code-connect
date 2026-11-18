import { ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from './password.js';
import type { CreateUserDto } from './user.schemas.js';
import type { UserResponse } from './user.response.js';
import {
  EMAIL_TAKEN,
  USERNAME_TAKEN,
  UsersRepository,
  type UserRecord,
} from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create({
    name,
    email,
    username,
    password,
  }: CreateUserDto): Promise<UserRecord> {
    if (await this.usersRepository.findByEmail(email)) {
      throw new ConflictException(EMAIL_TAKEN);
    }
    if (await this.usersRepository.findByUsername(username)) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    const passwordHash = await hashPassword(password);
    return this.usersRepository.create({ name, email, username, passwordHash });
  }

  findByEmail(email: string): Promise<UserRecord | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): Promise<UserRecord | undefined> {
    return this.usersRepository.findById(id);
  }

  toResponse({
    id,
    name,
    email,
    username,
    createdAt,
  }: UserRecord): UserResponse {
    return { id, name, email, username, createdAt };
  }
}
