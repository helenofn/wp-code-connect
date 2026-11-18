import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from '../users/password.js';
import { UsersService } from '../users/users.service.js';
import type { JwtPayload } from './jwt-payload.js';
import type { TokenResponse } from './token.response.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<TokenResponse> {
    const user = await this.usersService.findByEmail(email);
    // Same error for an unknown email and a wrong password, so the response
    // doesn't reveal which emails are registered.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const { iat, exp } = this.jwtService.decode<{ iat: number; exp: number }>(
      accessToken,
    );
    return { accessToken, tokenType: 'Bearer', expiresIn: exp - iat };
  }
}
