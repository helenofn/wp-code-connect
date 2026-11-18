import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/** Request behind `OptionalAuthGuard`: `user` is set only for a valid token. */
export interface OptionalAuthRequest extends Request {
  user?: JwtPayload;
}
