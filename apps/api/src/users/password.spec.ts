import { hashPassword, verifyPassword } from './password.js';

describe('password', () => {
  it('hashes into salt:hash without keeping the plain password', async () => {
    const stored = await hashPassword('s3cret-pass');

    expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
    expect(stored).not.toContain('s3cret-pass');
  });

  it('uses a random salt, so the same password hashes differently', async () => {
    const first = await hashPassword('s3cret-pass');
    const second = await hashPassword('s3cret-pass');

    expect(first).not.toBe(second);
  });

  it('verifies the right password', async () => {
    const stored = await hashPassword('s3cret-pass');

    await expect(verifyPassword('s3cret-pass', stored)).resolves.toBe(true);
  });

  it('rejects a wrong password', async () => {
    const stored = await hashPassword('s3cret-pass');

    await expect(verifyPassword('wrong-pass', stored)).resolves.toBe(false);
  });

  it('rejects a malformed stored hash', async () => {
    await expect(verifyPassword('s3cret-pass', 'not-a-hash')).resolves.toBe(
      false,
    );
  });
});
