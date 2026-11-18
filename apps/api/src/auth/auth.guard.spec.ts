import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard.js';

function contextFor(request: Record<string, any>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  let verifyAsync: ReturnType<typeof vi.fn>;
  let guard: AuthGuard;

  beforeEach(() => {
    verifyAsync = vi.fn();
    guard = new AuthGuard({ verifyAsync } as unknown as JwtService);
  });

  it('throws 401 when there is no Authorization header', async () => {
    await expect(
      guard.canActivate(contextFor({ headers: {} })),
    ).rejects.toThrow(UnauthorizedException);
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('throws 401 when the scheme is not Bearer', async () => {
    const request = { headers: { authorization: 'Basic abc' } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('throws 401 when the token is invalid', async () => {
    verifyAsync.mockRejectedValue(new Error('invalid signature'));
    const request = { headers: { authorization: 'Bearer bad.token' } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
    expect(verifyAsync).toHaveBeenCalledWith('bad.token');
  });

  it('sets request.user from a valid token', async () => {
    const payload = { sub: 'user-1', email: 'ada@example.com' };
    verifyAsync.mockResolvedValue(payload);
    const request: Record<string, any> = {
      headers: { authorization: 'Bearer good.token' },
    };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(verifyAsync).toHaveBeenCalledWith('good.token');
    expect(request.user).toEqual(payload);
  });
});
