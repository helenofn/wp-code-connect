import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { createTestApp, signUpAndLogin } from './helpers.js';

describe('Posts (e2e)', () => {
  let app: INestApplication<App>;
  let ada: { id: string; auth: string };

  beforeEach(async () => {
    app = await createTestApp();
    ada = await signUpAndLogin(app, 'ada');
  });

  afterEach(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  const createPost = (body: object, auth = ada.auth) =>
    http().post('/posts').set('Authorization', auth).send(body);

  const newPost = {
    title: 'React zero to hero',
    description: 'Aprenda componentes, hooks e acessibilidade.',
    code: 'const App = () => <h1>Oi</h1>',
    thumbnailUrl: 'https://example.com/react.png',
    tags: ['React', 'Front-end', 'react'],
  };

  describe('POST /posts', () => {
    it('creates the post and returns 201 with a Location header', async () => {
      const res = await createPost(newPost).expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPost.title,
        description: newPost.description,
        code: newPost.code,
        thumbnailUrl: newPost.thumbnailUrl,
        tags: ['react', 'front-end'],
        likesCount: 0,
        commentsCount: 0,
        likedByMe: false,
        author: { id: ada.id, name: 'ada', username: 'ada' },
        createdAt: expect.any(String),
      });
      expect(res.headers.location).toBe(`/posts/${res.body.id}`);
    });

    it('accepts a post without thumbnail or code', async () => {
      const res = await createPost({
        title: 'Sem imagem',
        description: 'Mostra o placeholder',
      }).expect(201);

      expect(res.body).toMatchObject({
        thumbnailUrl: null,
        code: null,
        tags: [],
      });
    });

    it('returns 401 without a token', async () => {
      await http().post('/posts').send(newPost).expect(401);
    });

    it('returns 400 for an invalid body', async () => {
      await createPost({
        title: '',
        description: 'x',
        thumbnailUrl: 'javascript:alert(1)',
      }).expect(400);
    });
  });

  describe('GET /posts', () => {
    beforeEach(async () => {
      await createPost({
        title: 'Hooks no React',
        description: 'useEffect sem medo',
        tags: ['react'],
      }).expect(201);
      await createPost({
        title: 'Acessibilidade na web',
        description: 'Leitores de tela e contraste',
        tags: ['acessibilidade', 'front-end'],
      }).expect(201);
      await createPost({
        title: 'APIs com NestJS',
        description: 'Controllers e módulos',
        tags: ['node'],
      }).expect(201);
    });

    it('lists posts for anonymous users, newest first, with metadata', async () => {
      const res = await http().get('/posts').expect(200);

      expect(res.body.items.map((p: { title: string }) => p.title)).toEqual([
        'APIs com NestJS',
        'Acessibilidade na web',
        'Hooks no React',
      ]);
      expect(res.body.items[0]).not.toHaveProperty('code');
      expect(res.body.items[0].likedByMe).toBe(false);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 12,
        total: 3,
        totalPages: 1,
      });
    });

    it('searches title and description with full-text search', async () => {
      const res = await http()
        .get('/posts')
        .query({ q: 'leitores' })
        .expect(200);

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].title).toBe('Acessibilidade na web');
    });

    it('matches word prefixes while typing', async () => {
      const res = await http().get('/posts').query({ q: 'reac' }).expect(200);

      expect(res.body.items.map((p: { title: string }) => p.title)).toEqual([
        'Hooks no React',
      ]);
    });

    it('ignores tsquery syntax in the search text', async () => {
      await http().get('/posts').query({ q: "react & !(':*" }).expect(200);
    });

    it('filters by tags (all must match)', async () => {
      const res = await http()
        .get('/posts')
        .query({ tags: 'Front-end,acessibilidade' })
        .expect(200);

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].title).toBe('Acessibilidade na web');
    });

    it('paginates', async () => {
      const res = await http()
        .get('/posts')
        .query({ page: 2, limit: 2 })
        .expect(200);

      expect(res.body.items).toHaveLength(1);
      expect(res.body.meta).toEqual({
        page: 2,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });

    it('sorts by likes for the popular tab', async () => {
      const { body } = await http().get('/posts').expect(200);
      const oldest = body.items[2];
      await http()
        .put(`/posts/${oldest.id}/likes/me`)
        .set('Authorization', ada.auth)
        .expect(204);

      const res = await http()
        .get('/posts')
        .query({ sort: '-likesCount' })
        .set('Authorization', ada.auth)
        .expect(200);

      expect(res.body.items[0]).toMatchObject({
        id: oldest.id,
        likesCount: 1,
        likedByMe: true,
      });
    });

    it('returns 400 for invalid query parameters', async () => {
      await http().get('/posts').query({ sort: 'title' }).expect(400);
      await http().get('/posts').query({ limit: 500 }).expect(400);
    });
  });

  describe('GET /posts/:id', () => {
    it('returns the post with its code', async () => {
      const { body: created } = await createPost(newPost).expect(201);

      const res = await http().get(`/posts/${created.id}`).expect(200);

      expect(res.body).toEqual(created);
    });

    it('returns 404 for a missing post', async () => {
      await http()
        .get('/posts/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('returns 400 for a malformed id', async () => {
      await http().get('/posts/not-a-uuid').expect(400);
    });
  });

  describe('PUT/DELETE /posts/:id/likes/me', () => {
    let postId: string;

    beforeEach(async () => {
      ({
        body: { id: postId },
      } = await createPost(newPost).expect(201));
    });

    const likes = (method: 'put' | 'delete', auth = ada.auth) =>
      http()[method](`/posts/${postId}/likes/me`).set('Authorization', auth);

    it('likes idempotently and counts each user once', async () => {
      const grace = await signUpAndLogin(app, 'grace');

      await likes('put').expect(204);
      await likes('put').expect(204);
      await likes('put', grace.auth).expect(204);

      const res = await http()
        .get(`/posts/${postId}`)
        .set('Authorization', ada.auth)
        .expect(200);
      expect(res.body).toMatchObject({ likesCount: 2, likedByMe: true });
    });

    it('unlikes idempotently', async () => {
      await likes('put').expect(204);
      await likes('delete').expect(204);
      await likes('delete').expect(204);

      const res = await http()
        .get(`/posts/${postId}`)
        .set('Authorization', ada.auth)
        .expect(200);
      expect(res.body).toMatchObject({ likesCount: 0, likedByMe: false });
    });

    it('returns 401 for anonymous users', async () => {
      await http().put(`/posts/${postId}/likes/me`).expect(401);
      await http().delete(`/posts/${postId}/likes/me`).expect(401);
    });

    it('returns 404 for a missing post', async () => {
      await http()
        .put('/posts/00000000-0000-0000-0000-000000000000/likes/me')
        .set('Authorization', ada.auth)
        .expect(404);
    });
  });
});
