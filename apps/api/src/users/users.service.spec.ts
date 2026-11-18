import { ConflictException } from '@nestjs/common';
import { verifyPassword } from './password.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let repository: UsersRepository;
  let service: UsersService;

  const dto = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 's3cret-pass',
  };

  beforeEach(() => {
    repository = new UsersRepository();
    service = new UsersService(repository);
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
    expect(service.findById(user.id)).toBe(user);
    expect(service.findByEmail(dto.email)).toBe(user);
  });

  it('throws 409 when the email is already registered', async () => {
    await service.create(dto);

    await expect(service.create({ ...dto, name: 'Other' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('does not hash the password when the email is taken', async () => {
    await service.create(dto);
    const create = vi.spyOn(repository, 'create');

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(create).not.toHaveBeenCalled();
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
