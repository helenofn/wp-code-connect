import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { OptionalAuthGuard } from './optional-auth.guard.js';

function contextFor(request: Record<string, any>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('OptionalAuthGuard', () => {
  let verifyAsync: ReturnType<typeof vi.fn>;
  let guard: OptionalAuthGuard;

  beforeEach(() => {
    verifyAsync = vi.fn();
    guard = new OptionalAuthGuard({ verifyAsync } as unknown as JwtService);
  });

  it('lets anonymous requests through without a user', async () => {
    const request: Record<string, any> = { headers: {} };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request.user).toBeUndefined();
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('treats an invalid token as anonymous', async () => {
    verifyAsync.mockRejectedValue(new Error('jwt expired'));
    const request: Record<string, any> = {
      headers: { authorization: 'Bearer old.token' },
    };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request.user).toBeUndefined();
  });

  it('sets request.user from a valid token', async () => {
    const payload = { sub: 'user-1', email: 'ada@example.com' };
    verifyAsync.mockResolvedValue(payload);
    const request: Record<string, any> = {
      headers: { authorization: 'Bearer good.token' },
    };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request.user).toEqual(payload);
  });
});
