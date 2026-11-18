import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { CommentSection } from '../components/organisms/CommentSection/CommentSection'
import { LoginForm } from '../components/organisms/LoginForm/LoginForm'
import { NewPostForm } from '../components/organisms/NewPostForm/NewPostForm'
import { SignupForm } from '../components/organisms/SignupForm/SignupForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { getMe } from '../services/api/auth'
import { listComments } from '../services/api/comments'
import { getPost, listPosts } from '../services/api/posts'
import { clearToken, saveToken } from '../services/api/tokenStorage'
import { expectNoA11yViolations } from '../test/a11y'
import { aPost, aThread } from '../test/fixtures'
import { ana, renderApp } from '../test/render'
import { FeedPage } from './FeedPage'
import { LoginPage } from './LoginPage'
import { NewPostPage } from './NewPostPage'
import { PostDetailsPage } from './PostDetailsPage'
import { SignupPage } from './SignupPage'
import { socialProviders } from './socialProviders'

vi.mock('../services/api/auth')
vi.mock('../services/api/posts')
vi.mock('../services/api/comments')

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// Acessibilidade estrutural (WCAG 2.2 A/AA) das telas e dos organismos.
describe('accessibility (WCAG 2.2 AA, jsdom)', () => {
  beforeEach(() => {
    vi.mocked(getMe).mockResolvedValue(ana)
    vi.mocked(listPosts).mockResolvedValue({
      items: [aPost(), aPost({ id: 'p2', title: 'Sem imagem', thumbnailUrl: null })],
      meta: { page: 1, limit: 12, total: 2, totalPages: 1 },
    })
    vi.mocked(getPost).mockResolvedValue(aPost())
    vi.mocked(listComments).mockResolvedValue([aThread()])
  })

  afterEach(() => clearToken())

  it.each([
    ['visitors', false],
    ['signed-in users', true],
  ])('FeedPage has no axe violations for %s', async (_who, signedIn) => {
    if (signedIn) saveToken('jwt', false)
    const { container } = renderApp({ path: '/', appRoutes: [{ path: '/', element: <FeedPage /> }] })
    await screen.findByRole('heading', { name: 'React zero to hero' })
    await expectNoA11yViolations(container)
  })

  it.each([
    ['visitors', false],
    ['signed-in users', true],
  ])('PostDetailsPage has no axe violations for %s', async (_who, signedIn) => {
    if (signedIn) saveToken('jwt', false)
    const { container } = renderApp({
      path: '/posts/p1',
      appRoutes: [{ path: '/posts/:id', element: <PostDetailsPage /> }],
    })
    await screen.findByRole('heading', { level: 1, name: 'React zero to hero' })
    await expectNoA11yViolations(container)
  })

  it('NewPostPage has no axe violations', async () => {
    saveToken('jwt', false)
    const { container } = renderApp({
      path: '/publicar',
      appRoutes: [{ path: '/publicar', element: <NewPostPage /> }],
    })
    await screen.findByRole('heading', { level: 1, name: 'Novo projeto' })
    await expectNoA11yViolations(container)
  })

  it.each([
    ['LoginPage', () => <LoginPage />],
    ['SignupPage', () => <SignupPage />],
  ])('%s has no axe violations', async (_name, ui) => {
    const { container } = renderApp({ path: '/', routes: [{ path: '/', element: ui() }] })
    await expectNoA11yViolations(container)
  })

  it.each([
    ['LoginForm', () => <LoginForm onSubmit={vi.fn()} />],
    ['SignupForm', () => <SignupForm onSubmit={vi.fn()} />],
    ['SocialLogin', () => <SocialLogin providers={socialProviders} />],
    ['NewPostForm', () => <NewPostForm onSubmit={vi.fn()} onDiscard={vi.fn()} />],
    [
      'CommentSection',
      () => <CommentSection threads={[aThread()]} canComment onSubmit={vi.fn()} />,
    ],
  ])('%s has no axe violations', async (_name, ui) => {
    const { container } = renderWithRouter(ui())
    await expectNoA11yViolations(container)
  })
})
