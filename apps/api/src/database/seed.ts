/**
 * Fills the dev database with mock users, posts, likes and comments.
 *
 *   pnpm db:seed
 *
 * Idempotent: it deletes the previous seed users (their posts, likes and
 * comments cascade) and creates everything again. Real users are untouched.
 * Every seed user signs in with SEED_PASSWORD.
 */
import { fakerPT_BR as faker } from '@faker-js/faker';
import { eq, like, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { hashPassword } from '../users/password.js';
import { comments, postLikes, posts, users } from './schema.js';

const SEED_EMAIL_DOMAIN = 'seed.codeconnect.dev';
const SEED_PASSWORD = 'senha1234';
const USER_COUNT = 8;
const POST_COUNT = 40;

// Served by the web app (apps/web/public/thumbnails).
const THUMBNAILS = [
  '/thumbnails/project-1.png',
  '/thumbnails/project-2.jpg',
  '/thumbnails/project-3.jpg',
  '/thumbnails/project-4.jpg',
  '/thumbnails/project-5.jpg',
  '/thumbnails/project-6.jpg',
];
// Points nowhere, so the web app has to fall back to its placeholder.
const BROKEN_THUMBNAIL = '/thumbnails/nao-existe.png';

const TAGS = [
  'react',
  'front-end',
  'acessibilidade',
  'css',
  'typescript',
  'javascript',
  'node',
  'back-end',
  'ux',
  'testes',
  'nestjs',
  'design-system',
];

const SUBJECTS = [
  'React zero to hero',
  'Hooks personalizados no React',
  'Formulários acessíveis',
  'Grid e Flexbox na prática',
  'Tipos avançados em TypeScript',
  'Animações com CSS',
  'APIs REST com NestJS',
  'Testes com Vitest e Testing Library',
  'Design system do zero',
  'Dark mode sem dor de cabeça',
  'Busca full-text com Postgres',
  'Autenticação com JWT',
  'Componentes com Tailwind',
  'Leitores de tela na prática',
  'Performance no front-end',
  'Clean code em JavaScript',
];

const SNIPPETS = [
  `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)

const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)

const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}`,
  `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}`,
  `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}`,
  `@Get(':id')
findOne(@Param('id', { schema: z.uuid() }) id: string) {
  return this.postsService.findById(id)
}`,
  `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}`,
];

const COMMENTS = [
  'Achei muito bom seu código, parabéns!',
  'Quanto tempo você levou para finalizar esse projeto?',
  'Espero chegar um dia nesse nível! Muito bom!',
  'Salvei aqui para estudar depois.',
  'Que explicação clara, obrigado por compartilhar!',
  'Você tem o repositório disponível?',
  'Usei isso no meu projeto e funcionou de primeira.',
];

const REPLIES = [
  'Até que foi rápido, uns 3 dias!',
  'Valeu! Se precisar de ajuda é só chamar.',
  'Obrigado! Já já coloco o link do repositório.',
  'Oba! Vou mandar uma mensagem!',
];

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set (copy apps/api/.env.example)');
  }
  const db = drizzle({ connection: url });
  faker.seed(42);

  try {
    await db.transaction(async (tx) => {
      await tx.delete(users).where(like(users.email, `%@${SEED_EMAIL_DOMAIN}`));

      const passwordHash = await hashPassword(SEED_PASSWORD);
      const seedUsers = await tx
        .insert(users)
        .values(
          Array.from({ length: USER_COUNT }, (_, i) => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const username = faker.internet
              .username({ firstName, lastName })
              .toLowerCase()
              .normalize('NFD')
              .replace(/[^a-z0-9_.]/g, '')
              .slice(0, 24);
            return {
              name: `${firstName} ${lastName}`,
              username: `${username}${i}`,
              email: `${username}${i}@${SEED_EMAIL_DOMAIN}`,
              passwordHash,
            };
          }),
        )
        .returning({ id: users.id });

      const now = Date.now();
      const seedPosts = await tx
        .insert(posts)
        .values(
          Array.from({ length: POST_COUNT }, (_, i) => {
            const subject = SUBJECTS[i % SUBJECTS.length]!;
            // ~30% without image and two broken links, to show the placeholder.
            const thumbnailUrl =
              i % 10 < 3
                ? null
                : i === 5 || i === 17
                  ? BROKEN_THUMBNAIL
                  : THUMBNAILS[i % THUMBNAILS.length]!;
            const createdAt = new Date(
              now - (POST_COUNT - i) * 1000 * 60 * 60 * 7,
            );
            return {
              authorId: faker.helpers.arrayElement(seedUsers).id,
              title:
                i < SUBJECTS.length
                  ? subject
                  : `${subject} (parte ${Math.floor(i / SUBJECTS.length) + 1})`,
              description: faker.lorem.sentences({ min: 2, max: 3 }),
              code: SNIPPETS[i % SNIPPETS.length]!,
              thumbnailUrl,
              tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 4 }),
              createdAt,
              updatedAt: createdAt,
            };
          }),
        )
        .returning({ id: posts.id });

      for (const post of seedPosts) {
        const likers = faker.helpers.arrayElements(seedUsers, {
          min: 0,
          max: USER_COUNT,
        });
        if (likers.length) {
          await tx
            .insert(postLikes)
            .values(likers.map((u) => ({ postId: post.id, userId: u.id })));
        }

        const threads = faker.number.int({ min: 0, max: 3 });
        for (let t = 0; t < threads; t++) {
          const [parent] = await tx
            .insert(comments)
            .values({
              postId: post.id,
              authorId: faker.helpers.arrayElement(seedUsers).id,
              body: faker.helpers.arrayElement(COMMENTS),
            })
            .returning({ id: comments.id });
          const replies = faker.number.int({ min: 0, max: 2 });
          for (let r = 0; r < replies; r++) {
            await tx.insert(comments).values({
              postId: post.id,
              authorId: faker.helpers.arrayElement(seedUsers).id,
              parentId: parent!.id,
              body: faker.helpers.arrayElement(REPLIES),
            });
          }
        }

        // Counters are derived from the rows, so they always match.
        await tx
          .update(posts)
          .set({
            likesCount: likers.length,
            commentsCount: sql`(select count(*) from ${comments} where ${comments.postId} = ${post.id})`,
          })
          .where(eq(posts.id, post.id));
      }

      console.log(
        `Seeded ${seedUsers.length} users and ${seedPosts.length} posts.`,
      );
      console.log(
        `Sign in with any *@${SEED_EMAIL_DOMAIN} email and password "${SEED_PASSWORD}".`,
      );
    });
  } finally {
    await db.$client.end();
  }
}

await seed();
