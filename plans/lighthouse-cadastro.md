# Plano: correções do Lighthouse na página de Cadastro

## Contexto

O relatório [lighthouse/pagina-cadastro-lighthouse.js](lighthouse/pagina-cadastro-lighthouse.js) (Lighthouse 13.5, desktop) deu estas notas:
**Desempenho 51 · Acessibilidade 100 · Práticas recomendadas 96 · SEO 83**.

Ponto importante: o relatório foi gerado com o **servidor de desenvolvimento do Vite** (`localhost:5173`)
e com **extensões do Chrome ativas**, como o próprio Lighthouse avisa. Isso distorce boa parte do resultado:

| Auditoria | Causa real | Ação |
|---|---|---|
| JS não minificado (4,3 MB), JS não usado (2,6 MB), payload de 6,9 MB, TBT 250 ms, TTI 5,1 s | O modo dev serve `react-dom` (3 MB), `react-router` (1,7 MB), `@vite/client` e HMR sem minificar | Não exige código: medir no build de produção |
| `robots-txt` (24 erros) | Não existe `robots.txt`, e o fallback de SPA devolve o `index.html` | **Corrigir** |
| `inspector-issues` (CSP, sem itens) | Provavelmente extensão ou Vite dev | Rever depois de medir no build |

Problemas reais, que valem também em produção:

1. **Banner `cadastro.png` com 1,4 MB** (PNG 1344×896 RGBA). Ele é o elemento de LCP (5,0 s). O Lighthouse estima 1,33 MB de economia com WebP/AVIF. O `login.png`, com 1,3 MB, tem o mesmo problema.
2. **LCP sem `fetchpriority="high"`** e não detectável no HTML inicial (SPA renderizada no cliente).
3. **Google Fonts bloqueia a renderização** (CSS de terceiros, ~330 ms) e carrega o peso 700, que não é usado. Hoje são usados 400, 500 (`font-medium`) e 600 (`font-semibold`).
4. **Imagens sem `width`/`height`** (`unsized-images`): ícones github/gmail, `check.svg` e, pelo mesmo motivo, as partes do logo e o banner.
5. **Sem `<meta name="description">`** (SEO).

## Mudanças

### 1. Banners em WebP (maior ganho: LCP, peso, Speed Index)
- Converter uma única vez `public/banners/{login,cadastro}.png` para `.webp`, mantendo 1344×896 (a caixa exibida tem até 408×678 com `object-cover`, então não dá para reduzir a altura). Usar qualidade ~80 com `pnpm dlx sharp-cli` (ferramenta temporária, não entra no `package.json`). A meta é ficar com menos de 150 KB cada.
- Apagar os PNGs e trocar `bannerSrc` em [LoginPage.tsx](apps/web/src/pages/LoginPage.tsx) e [SignupPage.tsx](apps/web/src/pages/SignupPage.tsx).

### 2. Prioridade do LCP, em [AuthLayout.tsx](apps/web/src/components/templates/AuthLayout/AuthLayout.tsx)
- No `<img>` do banner: `fetchPriority="high"`, `decoding="async"`, `width={1344} height={896}`. A classe `size-full object-cover` continua controlando o tamanho na tela.
- Observação: o critério "detectável no documento inicial" só seria atendido com pré-renderização/SSR ou um preload por rota no `index.html`. Isso fica **fora do escopo**; com o WebP e o `fetchpriority`, o ganho restante é pequeno.

### 3. Fonte auto-hospedada (remove o bloqueio de renderização)
- Adicionar `@fontsource/prompt` e importar só os pesos 400, 500 e 600 em [main.tsx](apps/web/src/main.tsx) (`@fontsource/prompt/400.css` etc.). O Vite empacota os `.woff2` e eles passam a vir da mesma origem, com `font-display: swap`.
- Remover de [index.html](apps/web/index.html) os `preconnect` e o `<link>` do Google Fonts. O `--font-sans` em [index.css](apps/web/src/index.css) continua igual.

### 4. Dimensões explícitas nas imagens (CLS)
- [SocialLoginButton.tsx](apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.tsx): receber `iconWidth`/`iconHeight` (ou `iconSize: {width,height}`) e repassar ao `<img>`. Adicionar o campo em `SocialProvider` ([SocialLogin.tsx](apps/web/src/components/organisms/SocialLogin/SocialLogin.tsx)) e preencher em [socialProviders.ts](apps/web/src/pages/socialProviders.ts): github 33×32, gmail 28×28 (valores do `viewBox` dos SVGs).
- [Checkbox.tsx](apps/web/src/components/atoms/Checkbox/Checkbox.tsx): `width={16} height={16}` no `check.svg`.
- [Logo.tsx](apps/web/src/components/atoms/Logo/Logo.tsx): dimensões nativas dos três SVGs (15×23, 15×23, 93×40).

### 5. SEO
- [index.html](apps/web/index.html): `<meta name="description" content="Code Connect: entre ou crie sua conta para compartilhar e descobrir projetos de código.">` (texto ajustável).
- Criar `apps/web/public/robots.txt` com `User-agent: *` / `Allow: /`.

### 6. Testes
- Atualizar os testes de componente afetados para cobrir as novas props: `SocialLoginButton.test.tsx` (o `<img>` recebe width/height) e o teste do `AuthLayout` (o banner tem `fetchpriority="high"`). Os testes devem continuar consultando por role/label.
- Os testes de acessibilidade (`pnpm test:a11y`) precisam continuar passando, sobretudo o contraste com a nova fonte.

## Verificação
1. `pnpm build:web` (tsc + vite) e `pnpm lint` sem erros; `pnpm test:web` e `pnpm test:a11y` verdes.
2. Conferir os tamanhos: `ls -la apps/web/dist/banners` (menos de 150 KB cada) e o JS em `dist/assets` (minificado, centenas de KB).
3. **Medir de novo no build de produção**, em janela anônima (sem extensões): `pnpm web build && pnpm web preview` e rodar o Lighthouse em `http://localhost:4173/cadastro` (DevTools ou `pnpm dlx lighthouse http://localhost:4173/cadastro --preset=desktop`). Esperado: Desempenho acima de 90, SEO 100, Práticas recomendadas 100 (confirmar se o aviso de CSP some), Acessibilidade 100.
4. Conferir no navegador que o banner, a fonte Prompt e os ícones aparecem como antes nas duas telas.

## Commits (Conventional Commits)
- `perf(web): convert auth banners to webp and prioritize lcp image`
- `perf(web): self-host prompt font`
- `fix(web): set explicit dimensions on images`
- `feat(web): add meta description and robots.txt`
