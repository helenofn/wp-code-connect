import { ConflictException } from '@nestjs/common';
import { verifyPassword } from './password.js';
import type {
  NewUserRecord,
  UserRecord,
  UsersRepository,
} from './users.repository.js';
import { UsersService } from './users.service.js';

/** In-memory stand-in for the Postgres-backed repository. */
function createFakeRepository() {
  const rows: UserRecord[] = [];
  return {
    create: vi.fn((data: NewUserRecord) => {
      const user: UserRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      rows.push(user);
      return Promise.resolve(user);
    }),
    findByEmail: vi.fn((email: string) =>
      Promise.resolve(rows.find((user) => user.email === email)),
    ),
    findById: vi.fn((id: string) =>
      Promise.resolve(rows.find((user) => user.id === id)),
    ),
  };
}

describe('UsersService', () => {
  let repository: ReturnType<typeof createFakeRepository>;
  let service: UsersService;

  const dto = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 's3cret-pass',
  };

  beforeEach(() => {
    repository = createFakeRepository();
    service = new UsersService(repository as unknown as UsersRepository);
  });

  it('creates a user with a hashed password', async () => {
    const user = await service.create(dto);

    expect(user).toMatchObject({ name: dto.name, email: dto.email });
    expect(user.id).toEqual(expect.any(String));
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.passwordHash).not.toBe(dto.password);
    await expect(verifyPassword(dto.password, user.passwordHash)).resolves.toBe(
      true,
    );
    await expect(service.findById(user.id)).resolves.toBe(user);
    await expect(service.findByEmail(dto.email)).resolves.toBe(user);
  });

  it('throws 409 when the email is already registered', async () => {
    await service.create(dto);

    await expect(service.create({ ...dto, name: 'Other' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('does not hash the password when the email is taken', async () => {
    await service.create(dto);
    repository.create.mockClear();

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('leaves the password hash out of the response', async () => {
    const user = await service.create(dto);

    const response = service.toResponse(user);

    expect(response).toEqual({
      id: user.id,
      name: dto.name,
      email: dto.email,
      createdAt: user.createdAt,
    });
    expect(response).not.toHaveProperty('passwordHash');
  });
});
