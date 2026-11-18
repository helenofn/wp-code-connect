import {
  StandardSchemaValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const newUser = {
    name: 'Ada Lovelace',
    email: 'Ada@Example.com',
    password: 's3cret-pass',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const signUp = (body: object = newUser) =>
    request(app.getHttpServer()).post('/users').send(body);

  const signIn = (body: object) =>
    request(app.getHttpServer()).post('/auth/login').send(body);

  describe('POST /users', () => {
    it('creates the user and returns 201 with a Location header', async () => {
      const res = await signUp().expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        createdAt: expect.any(String),
      });
      expect(res.headers.location).toBe(`/users/${res.body.id}`);
      expect(JSON.stringify(res.body)).not.toContain('s3cret-pass');
    });

    it('returns 409 when the email is already registered', async () => {
      await signUp().expect(201);

      const res = await signUp({
        ...newUser,
        email: 'ada@example.com',
      }).expect(409);

      expect(res.body).toMatchObject({
        statusCode: 409,
        error: 'Conflict',
        message: 'Email already registered',
      });
    });

    it('returns 400 for an invalid body', async () => {
      const res = await signUp({
        name: '   ',
        email: 'not-an-email',
        password: 'short',
      }).expect(400);

      expect(res.body).toMatchObject({ statusCode: 400, error: 'Bad Request' });
    });

    it('ignores unknown keys', async () => {
      const res = await signUp({ ...newUser, remember: true }).expect(201);

      expect(res.body).not.toHaveProperty('remember');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await signUp().expect(201);
    });

    it('returns a bearer token for valid credentials', async () => {
      const res = await signIn({
        email: 'ada@example.com',
        password: 's3cret-pass',
      }).expect(200);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
        tokenType: 'Bearer',
        expiresIn: 3600,
      });
    });

    it('returns 401 for a wrong password', async () => {
      const res = await signIn({
        email: 'ada@example.com',
        password: 'wrong-pass',
      }).expect(401);

      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    });

    it('returns the same 401 for an unknown email', async () => {
      const res = await signIn({
        email: 'nobody@example.com',
        password: 's3cret-pass',
      }).expect(401);

      expect(res.body.message).toBe('Invalid email or password');
    });

    it('returns 400 for an invalid body', async () => {
      await signIn({ email: 'ada@example.com' }).expect(400);
    });
  });

  describe('GET /auth/me', () => {
    it('returns the signed-in user', async () => {
      const { body: user } = await signUp().expect(201);
      const { body: token } = await signIn({
        email: 'ada@example.com',
        password: 's3cret-pass',
      }).expect(200);

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token.accessToken}`)
        .expect(200);

      expect(res.body).toEqual(user);
    });

    it('returns 401 without a token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('returns 401 with an invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer not.a.jwt')
        .expect(401);
    });
  });
});
