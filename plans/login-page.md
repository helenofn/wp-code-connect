# Plano: Página de Login (apps/web)

## Context
O `apps/web` ainda é o template do Vite. Precisamos construir a tela de Login do Code Connect conforme o layout anexado (card escuro, banner à esquerda, formulário à direita), seguindo Atomic Design + Tailwind + testes por componente (CLAUDE.md). A tela de Cadastro virá depois com o **mesmo layout base**, banner diferente e campos diferentes — então o layout (card + banner + slot de conteúdo) e os blocos de formulário precisam ser genéricos.

Observações dos assets:
- `public/banner-login.png` já contém o logo "code connect" → não precisamos de componente de logo.
- `public/github.png` / `public/gmail.png` já trazem o rótulo ("Github"/"Gmail") dentro da imagem → renderizar só a imagem com `alt`, sem texto duplicado.

## 1. Setup (pré-requisito do CLAUDE.md)
- `pnpm web add tailwindcss @tailwindcss/vite react-router`
- `pnpm web add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`
- `vite.config.ts`: plugin `tailwindcss()`; bloco `test` (environment `jsdom`, `globals: true`, `setupFiles: ./src/test/setup.ts`) — usar `/// <reference types="vitest/config" />`.
- `src/test/setup.ts`: importa `@testing-library/jest-dom/vitest` e `cleanup` afterEach.
- `tsconfig.app.json`: `types` += `vitest/globals`, `@testing-library/jest-dom`.
- `apps/web/package.json`: script `"test": "vitest run"`; root `package.json`: `"test:web": "pnpm --filter web test"`.
- `index.html`: `lang="pt-BR"`, título "Code Connect", `<link>` Google Fonts **Prompt** (400/500/600).
- `src/index.css` → substituir por `@import "tailwindcss";` + `@theme` com tokens:
  - `--font-sans: "Prompt", sans-serif`
  - cores: `--color-page: #00090E` (fundo externo), `--color-surface: #171D1F` (card), `--color-field: #888888` (input), `--color-offwhite: #E1E1E1`, `--color-primary: #81FE88` (botão/link verde), `--color-ink: #132E35` (texto do botão), `--color-muted: #BCBCBC`.
  - base: `body { @apply bg-page font-sans text-offwhite }`.
- Remover `App.css`, `src/assets/*` do template.

## 2. Componentes (Atomic Design)

**atoms/** (cada um com `X.test.tsx` ao lado)
- `Heading` — `level` (1|2), texto; h1 grande "Login".
- `Text` — parágrafo com variantes (`lead` p/ "Boas-vindas!...", `muted`).
- `Label` — `htmlFor` + children.
- `Input` — repassa `InputHTMLAttributes` (forwardRef não é necessário no React 19; `ref` como prop); estilo bg-field, rounded, placeholder.
- `Checkbox` — input nativo estilizado (borda + check verde) + label; `checked`/`onChange`.
- `Button` — `variant: 'primary'`, `type`, `children`, ícone opcional à direita; full width.
- `Link` — wrapper de `react-router` `Link` com variantes `underline` (Esqueci a senha) e `accent` (Crie seu cadastro).
- `Icon` — SVGs inline: `arrow-right`, `clipboard` (`aria-hidden`).
- `Divider` — linha horizontal com texto central opcional ("ou entre com outras contas").

**molecules/**
- `FormField` — `Label` + `Input`, gera `id` via `useId`; props `label`, `...inputProps`. Reutilizável no cadastro (nome, email, senha).
- `SocialLoginButton` — `<button>` com `<img src alt>` ; props `provider`, `icon`, `onClick`.
- `RememberForgotRow` — `Checkbox` "Lembrar-me" + `Link` "Esqueci a senha".

**organisms/**
- `LoginForm` — título, subtítulo, `FormField` email/usuário e senha, `RememberForgotRow`, `Button` "Login →". Estado controlado interno, `onSubmit({ identifier, password, remember })` via prop.
- `SocialLogin` — `Divider` + lista de `SocialLoginButton` recebida por props (`providers: {name, icon, onClick}[]`) — reaproveitável no cadastro.
- `AuthFooterCta` — texto "Ainda não tem conta?" + link accent com ícone; props `question`, `linkLabel`, `to`, `icon` (cadastro usará "Já tem conta? Faça seu login!").

**templates/**
- `AuthLayout` — página centralizada (`bg-page min-h-svh`), card `bg-surface rounded-[32px]`, grid 2 colunas em `lg` (banner | conteúdo), empilha no mobile (banner escondido ou reduzido). Props: `bannerSrc`, `bannerAlt`, `children`. **Este é o ponto de reuso do Cadastro** (só troca o banner e os children).

**pages/**
- `LoginPage` — compõe `AuthLayout(banner-login.png)` + `LoginForm` + `SocialLogin` (github/gmail) + `AuthFooterCta(to="/cadastro")`. Handlers `onSubmit`/social ficam aqui (por ora sem API — `console.info`/TODO, já que o web ainda não chama o api).

## 3. Rotas
- `src/App.tsx` → `BrowserRouter` com `/` → redirect `/login`, `/login` → `LoginPage`. (`/cadastro` entra depois.)
- `main.tsx` mantém import de `index.css`.

## 4. Testes (Vitest + RTL, queries por role/label)
- Atoms: renderizam; `Button` dispara onClick; `Checkbox` alterna; `Input` aceita digitação; `Link` tem href correto (render dentro de `MemoryRouter`).
- `FormField`: label associada ao input (`getByLabelText`).
- `LoginForm`: preencher campos via `user-event`, marcar lembrar-me, clicar "Login" → `onSubmit` chamado com os valores.
- `SocialLogin`: clica em "Github" → callback do provider.
- `AuthLayout`: renderiza banner (`getByRole('img', {name})`) e children.
- `LoginPage`: smoke test (heading "Login", link "Crie seu cadastro!" → `/cadastro`).

## Arquivos críticos
- `apps/web/vite.config.ts`, `apps/web/package.json`, `package.json` (root), `apps/web/index.html`, `apps/web/tsconfig.app.json`
- `apps/web/src/index.css`, `src/App.tsx`, `src/test/setup.ts`
- `apps/web/src/components/{atoms,molecules,organisms,templates}/**`, `apps/web/src/pages/LoginPage.tsx`

## Verificação
- `pnpm test:web` — todos os testes passam.
- `pnpm lint` e `pnpm build:web` (inclui `tsc -b`) sem erros.
- `pnpm dev:web` → abrir `http://localhost:5173/login` e comparar visualmente com o layout (desktop e largura mobile).

## Commits (Conventional Commits)
1. `build(web): set up tailwind, vitest and react router`
2. `feat(web): add auth atoms and molecules`
3. `feat(web): add login page with reusable auth layout`
