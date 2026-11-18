import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { extractBearerToken } from './bearer-token.js';
import type { JwtPayload, OptionalAuthRequest } from './jwt-payload.js';

/**
 * For public routes that personalize the response when signed in (e.g.
 * `likedByMe`). A valid token sets `request.user`; a missing, invalid or
 * expired one lets the request through as anonymous.
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request);
    if (token) {
      try {
        (request as OptionalAuthRequest).user =
          await this.jwtService.verifyAsync<JwtPayload>(token);
      } catch {
        // Anonymous.
      }
    }
    return true;
  }
}
