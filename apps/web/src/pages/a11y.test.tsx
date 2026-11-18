import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { LoginForm } from '../components/organisms/LoginForm/LoginForm'
import { SignupForm } from '../components/organisms/SignupForm/SignupForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { getMe } from '../services/api/auth'
import { clearToken, saveToken } from '../services/api/tokenStorage'
import { expectNoA11yViolations } from '../test/a11y'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage'
import { SignupPage } from './SignupPage'
import { socialProviders } from './socialProviders'

vi.mock('../services/api/auth')

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// Acessibilidade estrutural (WCAG 2.2 A/AA) das telas e dos organismos.
describe('accessibility (WCAG 2.2 AA, jsdom)', () => {
  afterEach(() => clearToken())

  it('HomePage has no axe violations', async () => {
    saveToken('jwt', false)
    vi.mocked(getMe).mockResolvedValue({
      id: '1',
      name: 'Ana Souza',
      email: 'ana@example.com',
      createdAt: '2026-11-17T00:00:00.000Z',
    })
    const { container } = renderWithRouter(<HomePage />)
    await screen.findByRole('heading', { level: 1, name: 'Olá, Ana Souza' })
    await expectNoA11yViolations(container)
  })

  it.each([
    ['LoginPage', () => <LoginPage />],
    ['SignupPage', () => <SignupPage />],
    ['LoginForm', () => <LoginForm onSubmit={vi.fn()} />],
    ['SignupForm', () => <SignupForm onSubmit={vi.fn()} />],
    ['SocialLogin', () => <SocialLogin providers={socialProviders} />],
  ])('%s has no axe violations', async (_name, ui) => {
    const { container } = renderWithRouter(ui())
    await expectNoA11yViolations(container)
  })
})
