import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { createUserSchema, type CreateUserDto } from './user.schemas.js';
import { UserResponse } from './user.response.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: UserResponse,
    description: 'User created. The Location header points to the new user.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Email already registered' })
  async create(
    @Body({ schema: createUserSchema }) dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const user = await this.usersService.create(dto);
    res.location(`/users/${user.id}`);
    return this.usersService.toResponse(user);
  }
}
