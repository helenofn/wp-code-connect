# Plano: Cadastro de usuário, login JWT e usuário logado (apps/api)

## Context
O web já tem as telas de Login e Cadastro (`SignupForm` envia `name`, `email`, `password`), mas a api ainda é o "Hello World" do Nest. Este plano cria o primeiro backend real: cadastrar usuário, fazer login com JWT e obter o usuário logado. O armazenamento é um array em memória (sem ORM nem banco), e as entradas e saídas ficam documentadas no Swagger.

Decisões já tomadas:
- **Auth:** `AuthGuard` escrito à mão com `@nestjs/jwt`, no padrão clássico da doc do Nest, e não `@nestjs/authentication`.
- **Rotas (`/auth/login` foge da regra REST de não ter verbos, por decisão do projeto):** `POST /users`, `POST /auth/login` e `GET /auth/me`.

## Dependências (apps/api)
`pnpm --filter api add @nestjs/jwt @nestjs/swagger @nestjs/config zod`
- `zod` precisa ser ≥ 4.2 para o `@nestjs/swagger` converter os schemas em OpenAPI sem um conversor extra.
- O hash de senha usa `scrypt` do `node:crypto` com salt aleatório, e a comparação usa `timingSafeEqual`. Assim não precisamos de bcrypt.

## Estrutura
```
src/
  main.ts                    # + StandardSchemaValidationPipe global, Swagger em /docs, enableCors
  app.module.ts              # + ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule
  users/
    users.module.ts          # exporta UsersService
    users.repository.ts      # private readonly users: UserRecord[] = []; create, findByEmail, findById
    users.service.ts         # create(): 409 se o e-mail já existe, faz o hash da senha; toResponse() remove o hash
    users.controller.ts      # POST /users → 201 + Location /users/:id
    user.schemas.ts          # createUserSchema (zod) + tipo CreateUserDto
    user.response.ts         # classe UserResponse com @ApiProperty: id, name, email, createdAt
    password.ts              # hashPassword / verifyPassword (scrypt)
  auth/
    auth.module.ts           # importa UsersModule e JwtModule.registerAsync (JWT_SECRET e expiresIn via ConfigService)
    auth.service.ts          # signIn(email, password) → 401 se as credenciais forem inválidas; assina { sub, email }
    auth.guard.ts            # canActivate: extractTokenFromHeader → jwtService.verifyAsync → request.user = payload; senão 401
    auth.controller.ts       # POST /auth/login → 200 { accessToken, tokenType: 'Bearer', expiresIn }
    token.schemas.ts         # createTokenSchema (email, password)
    token.response.ts        # classe TokenResponse com @ApiProperty
```
Todos os imports relativos terminam em `.js` (ESM).

## Contratos
| Método/rota | Body | Sucesso | Erros |
|---|---|---|---|
| `POST /users` | `{ name, email, password }`: nome com 1 a 100 caracteres depois do trim, e-mail válido (salvo em minúsculas), senha com pelo menos 8 caracteres | `201`, `UserResponse`, `Location: /users/{id}` | `400` validação, `409` e-mail já cadastrado |
| `POST /auth/login` | `{ email, password }` | `200`, `{ accessToken, tokenType, expiresIn }` | `400`, `401` "Invalid email or password" (mesma mensagem para e-mail inexistente e para senha errada) |
| `GET /auth/me` | `Authorization: Bearer <jwt>` | `200`, `UserResponse` | `401` |

- A validação usa `@Body({ schema })` com o `StandardSchemaValidationPipe` registrado globalmente, como manda o AGENTS.md. O zod descarta chaves desconhecidas, então o `remember` que o web envia é ignorado.
- Todos os erros usam o formato padrão do Nest, `{ statusCode, message, error }`, lançados com subclasses de `HttpException`.
- A senha e o hash nunca aparecem em uma resposta.
- Ainda não existe `GET /users/:id`, mas o `Location` aponta para a URI canônica, como pede o CLAUDE.md.

## Swagger
No `main.ts`: `DocumentBuilder` com título, versão e `.addBearerAuth()`, e depois `SwaggerModule.setup('docs', app, documentFactory)` (UI em `/docs`, JSON em `/docs-json`).
- **Inputs:** gerados automaticamente a partir dos schemas zod.
- **Outputs:** `@ApiCreatedResponse({ type: UserResponse })`, `@ApiOkResponse`, `@ApiConflictResponse`, `@ApiUnauthorizedResponse` e `@ApiBadRequestResponse`. Também `@ApiTags('users' | 'auth')`, e `@ApiBearerAuth()` no `/auth/me`.

## Config
`JWT_SECRET` e `JWT_EXPIRES_IN` (padrão `1h`) vêm do `.env` pelo `@nestjs/config`. Criar `apps/api/.env.example` e confirmar que o `.env` está no `.gitignore`. A app falha na inicialização se faltar o `JWT_SECRET`.

## Testes (Vitest, `vi.fn()`)
- **Unitários:**
  - `users.service.spec.ts`: criação, e-mail duplicado → 409, saída sem o hash.
  - `auth.service.spec.ts`: login válido assina o token, senha errada ou e-mail inexistente → 401.
  - `auth.guard.spec.ts`: sem header, token inválido, e token válido preenchendo `request.user`.
  - `password.spec.ts`.
- **E2E** `test/auth.e2e-spec.ts`:
  - cadastro → 201 + Location; e-mail duplicado → 409; body inválido → 400
  - login → token; senha errada → 401
  - `/auth/me` com o token → 200 com o usuário certo; `/auth/me` sem token ou com token inválido → 401

  Definir `JWT_SECRET` no `env` da config de e2e e aplicar o pipe global na app de teste.
- O controller Hello World e os testes dele continuam como estão.

## Verificação
1. `pnpm test:api`, `pnpm api test:e2e`, `pnpm lint` e `pnpm build:api`.
2. `pnpm dev:api`, depois abrir `http://localhost:3000/docs` e conferir os três endpoints com seus schemas e o botão Authorize. Rodar o fluxo na mão com curl: POST /users → POST /auth/login → GET /auth/me.

## Commit
`feat(api): add user signup, jwt tokens and me endpoint`. Opcionalmente, separar as dependências num commit `build(api)`.
