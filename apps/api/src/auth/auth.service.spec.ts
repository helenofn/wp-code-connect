import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../users/password.js';
import type { UserRecord } from '../users/users.repository.js';
import type { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let user: UserRecord;
  let usersService: { findByEmail: ReturnType<typeof vi.fn> };
  let jwtService: {
    signAsync: ReturnType<typeof vi.fn>;
    decode: ReturnType<typeof vi.fn>;
  };
  let service: AuthService;

  beforeAll(async () => {
    user = {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: await hashPassword('s3cret-pass'),
      createdAt: new Date(),
    };
  });

  beforeEach(() => {
    usersService = {
      findByEmail: vi.fn((email: string) =>
        Promise.resolve(email === user.email ? user : undefined),
      ),
    };
    jwtService = {
      signAsync: vi.fn().mockResolvedValue('signed.jwt.token'),
      decode: vi.fn().mockReturnValue({ iat: 1000, exp: 4600 }),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('signs a token with sub and email for valid credentials', async () => {
    const result = await service.signIn('ada@example.com', 's3cret-pass');

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'ada@example.com',
    });
    expect(result).toEqual({
      accessToken: 'signed.jwt.token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  it('throws 401 for a wrong password', async () => {
    await expect(
      service.signIn('ada@example.com', 'wrong-pass'),
    ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('throws the same 401 for an unknown email', async () => {
    await expect(
      service.signIn('nobody@example.com', 's3cret-pass'),
    ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
