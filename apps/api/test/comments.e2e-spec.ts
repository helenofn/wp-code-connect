import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { createTestApp, signUpAndLogin } from './helpers.js';

describe('Comments (e2e)', () => {
  let app: INestApplication<App>;
  let ada: { id: string; auth: string };
  let postId: string;

  beforeEach(async () => {
    app = await createTestApp();
    ada = await signUpAndLogin(app, 'ada');
    ({
      body: { id: postId },
    } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', ada.auth)
      .send({ title: 'Post', description: 'Descrição' })
      .expect(201));
  });

  afterEach(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  const comment = (body: object, auth = ada.auth, post = postId) =>
    http()
      .post(`/posts/${post}/comments`)
      .set('Authorization', auth)
      .send(body);

  it('creates a comment with 201 and a Location header', async () => {
    const res = await comment({ body: 'Muito bom!' }).expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      postId,
      parentId: null,
      body: 'Muito bom!',
      author: { id: ada.id, name: 'ada', username: 'ada' },
      createdAt: expect.any(String),
    });
    expect(res.headers.location).toBe(
      `/posts/${postId}/comments/${res.body.id}`,
    );
  });

  it('lists top-level comments with their replies and counts all of them', async () => {
    const { body: first } = await comment({ body: 'Primeiro' }).expect(201);
    const { body: reply } = await comment({
      body: 'Resposta',
      parentId: first.id,
    }).expect(201);
    await comment({ body: 'Segundo' }).expect(201);

    const res = await http().get(`/posts/${postId}/comments`).expect(200);

    expect(res.body.items).toHaveLength(2);
    expect(res.body.items[0]).toMatchObject({
      id: first.id,
      replies: [{ id: reply.id, parentId: first.id }],
    });
    expect(res.body.items[1]).toMatchObject({ body: 'Segundo', replies: [] });

    const { body: post } = await http().get(`/posts/${postId}`).expect(200);
    expect(post.commentsCount).toBe(3);
  });

  it('returns 422 when replying to a reply', async () => {
    const { body: first } = await comment({ body: 'Primeiro' }).expect(201);
    const { body: reply } = await comment({
      body: 'Resposta',
      parentId: first.id,
    }).expect(201);

    await comment({ body: 'Fundo demais', parentId: reply.id }).expect(422);
  });

  it('returns 422 for a parent that does not exist', async () => {
    await comment({
      body: 'Órfão',
      parentId: '00000000-0000-0000-0000-000000000000',
    }).expect(422);
  });

  it('returns 401 for anonymous users', async () => {
    await http()
      .post(`/posts/${postId}/comments`)
      .send({ body: 'Oi' })
      .expect(401);
  });

  it('returns 400 for an empty body', async () => {
    await comment({ body: '   ' }).expect(400);
  });

  it('returns 404 for a missing post', async () => {
    const missing = '00000000-0000-0000-0000-000000000000';
    await http().get(`/posts/${missing}/comments`).expect(404);
    await comment({ body: 'Oi' }, ada.auth, missing).expect(404);
  });
});
