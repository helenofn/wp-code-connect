import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponse } from '../users/user.response.js';
import { UsersService } from '../users/users.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import type { AuthenticatedRequest } from './jwt-payload.js';
import { createTokenSchema, type CreateTokenDto } from './token.schemas.js';
import { TokenResponse } from './token.response.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenResponse, description: 'Access token issued' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  login(
    @Body({ schema: createTokenSchema }) { email, password }: CreateTokenDto,
  ): Promise<TokenResponse> {
    return this.authService.signIn(email, password);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse, description: 'The signed-in user' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  async me(@Req() request: AuthenticatedRequest): Promise<UserResponse> {
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.usersService.toResponse(user);
  }
}
