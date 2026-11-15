# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`code-connect` is a pnpm workspace monorepo (`pnpm-workspace.yaml` → `apps/*`) with two independent apps:

- `apps/web` — React 19 + Vite 8 + TypeScript SPA (package name `web`)
- `apps/api` — NestJS 12 HTTP API on Express (package name `api`), listens on `PORT` or 3000

## Commands

Run everything from the repo root; the root `package.json` provides shortcuts so you don't have to `cd` into an app.

```bash
pnpm install            # install all workspace deps
pnpm dev                # run web (Vite) and api (nest --watch) in parallel
pnpm dev:web | pnpm dev:api
pnpm build              # build all apps (build:web / build:api for one)
pnpm lint               # oxlint in every app
pnpm test:api           # api unit tests (vitest run)

# Run any app script through its filter shortcut:
pnpm api <script> [args]    # e.g. pnpm api test:e2e, pnpm api test:cov, pnpm api format
pnpm web <script> [args]    # e.g. pnpm web preview
```

Single test file / test name (api):

```bash
pnpm api test src/app.controller.spec.ts
pnpm api test -t "should return"
```

- Unit tests: `apps/api/src/**/*.spec.ts` (`vitest.config.ts`). E2E tests: `apps/api/test/**/*.e2e-spec.ts` (`vitest.config.e2e.ts`, uses supertest). Vitest globals are enabled.
- The web app has no test setup yet (see Frontend conventions).
- Linting is **oxlint**, not ESLint. The api runs it type-aware (`oxlint --type-aware`, with `no-floating-promises` as an error); the web config enables the react/typescript/oxc plugins.
- The web build runs `tsc -b` before `vite build`, so type errors fail the build.

## Frontend conventions (`apps/web`)

- **Atomic Design.** Components live under `src/components/` in `atoms/`, `molecules/`, `organisms/` and `templates/`, and routed screens live in `src/pages/`. A component may only import from its own level or lower levels: atoms import no other components, molecules compose atoms, and so on. Pages compose templates and organisms and hold data fetching and state. Lower levels stay presentational and get their data through props.
- **Tailwind CSS** handles all styling, using utility classes in JSX. Don't add new `.css` files or CSS modules for component styles. The leftover template CSS (`App.css`, most of `index.css`) gets replaced by Tailwind as screens are rebuilt. Put repeated design values (colors, spacing, fonts) in the Tailwind theme rather than hard-coding them.
- **No arbitrary values in classes.** Don't write hex colors or pixel sizes inside class names (`text-[#e1e1e1]`, `text-[31px]`, `w-[407px]`, `rounded-[32px]`).
  - **Colors** come from the project palette, defined in the `@theme` block of `src/index.css`. Its names follow the color styles in Figma: `grafite` `#00090E` (page background), `cinza-escuro` `#171D1F` (card and input text), `cinza-medio` `#888888` (input background and borders), `offwhite` `#E1E1E1` (text), `verde-destaque` `#81FE88` (primary actions and links) and `verde-petroleo` `#132E35` (text on primary buttons). Use them as `bg-grafite`, `text-verde-destaque` and so on. When a design brings a new color, add it to the palette as `--color-<name>`, using the Figma style name in kebab-case, and don't hard-code it.
  - **Sizes** (font sizes, widths, heights, spacing and radius) use Tailwind's default tokens. When a Figma value isn't on the scale, round to the nearest token and don't add a custom one. For a tie, round up. Font sizes map as 31px → `text-3xl`, 22px → `text-2xl`, 18px → `text-lg`, 15px → `text-base` and 12.5px → `text-xs`. Add `/normal` (`text-lg/normal`) to keep the 1.5 line height used in Figma. The spacing scale is any multiple of 4px, so use `w-102` (408px), `size-4.5` (18px) or `left-8.5` (34px) rather than a bracketed pixel value.
  - The only accepted exception is a value that no Tailwind token can express and that isn't a size or a color, such as the banner crop `object-[51%_center]`.
- **Every component ships with a test** that covers its essential use: it renders with typical props, and its main interaction or variant works. The test sits next to the component as `ComponentName.test.tsx`. Use Vitest + React Testing Library, and query by role or label rather than by class names. A component without a test is unfinished work.
- Tailwind and the test stack aren't installed yet. Set them up before writing the first component: `tailwindcss` with `@tailwindcss/vite`, plus `vitest`, `@testing-library/react`, `@testing-library/user-event` and `jsdom`, and a `test` script in `apps/web/package.json`. Then add a `test:web` shortcut to the root `package.json`.

## Backend conventions (`apps/api`): REST

The API must follow REST principles:

- **Resources, not actions.** Use plural nouns for URIs (`/users`, `/users/:id`, `/users/:id/orders`), with no verbs in paths and no more than one level of nesting. Path segments are lowercase kebab-case. Name each controller after its resource.
- **HTTP methods carry the meaning.** `GET` reads and never has side effects. `POST` creates. `PUT` replaces the whole resource. `PATCH` updates part of it. `DELETE` removes it. `GET`, `PUT` and `DELETE` must be idempotent.
- **Status codes have to be right.** Use `200` for a successful read or update that returns a body, and `201 Created` for a create, with the new resource in the body and a `Location` header. Use `204 No Content` for a delete, or an update that returns nothing, and set it with `@HttpCode`. For errors, use `400` for invalid input, `401`/`403` for auth, `404` for a missing resource, `409` for a conflict and `422` for semantic validation errors. Throw Nest's built-in `HttpException` subclasses rather than returning errors with a `200` status.
- **Consistent representations.** Request and response bodies are JSON with camelCase fields. Validate request bodies, params and queries with schemas (see validation in AGENTS.md below). Error responses use a single shape across the whole API.
- **Collections.** Filtering, sorting and pagination go in query parameters (for example `?status=active&sort=-createdAt&page=2&limit=20`). Paginated responses return the items along with pagination metadata.
- **Stateless.** Each request carries everything needed to process it, so there is no server-side session state between requests.
- **Versioning** goes in the URI (`/v1/...`) through Nest's built-in versioning, once the first breaking change is needed.

## Git: Conventional Commits

Commit messages in both apps follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scope is the app or area: `web`, `api`, or `root` for workspace-level changes (e.g. `feat(web): add Button atom`, `fix(api): return 404 for missing user`).
- Description: imperative mood, lowercase, no trailing period. Mark breaking changes with `!` after the type/scope and/or a `BREAKING CHANGE:` footer.
- Keep each commit to one app when possible. Split changes that touch both apps unless they really belong together.

Allowed `type`s:

| Type      | When to use                                      |
| --------- | ------------------------------------------------ |
| `feat`    | New feature                                      |
| `fix`     | Bug fix                                          |
| `docs`    | Documentation only                               |
| `style`   | Formatting, no logic change                      |
| `refactor`| Code change that is neither a fix nor a feature  |
| `test`    | Adding or updating tests                         |
| `perf`    | Performance improvement                          |
| `ci`      | CI/CD configuration                              |
| `build`   | Build system or external dependency changes      |
| `revert`  | Reverts a previous commit                        |
| `chore`   | Maintenance, tooling, dependencies               |

## API conventions (from `apps/api/AGENTS.md`)

@apps/api/AGENTS.md

Key points to remember:
- The api is **ESM** (`"type": "module"`): relative imports must end in `.js` (e.g. `import { AppModule } from './app.module.js'`), use `import.meta.dirname` instead of `__dirname`, and `main.ts` uses top-level `await`.
- Tests use Vitest — mocks are `vi.fn()`, not `jest.fn()`.
- This NestJS version may be newer than your training data; consult https://docs.nestjs.com/llms.txt and prefer first-party `@nestjs/*` packages before adding third-party libraries.
