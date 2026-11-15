import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { LoginForm } from '../components/organisms/LoginForm/LoginForm'
import { SignupForm } from '../components/organisms/SignupForm/SignupForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { expectNoA11yViolations } from '../test/a11y'
import { LoginPage } from './LoginPage'
import { SignupPage } from './SignupPage'
import { socialProviders } from './socialProviders'

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// Acessibilidade estrutural (WCAG 2.2 A/AA) das telas e dos organismos.
describe('accessibility (WCAG 2.2 AA, jsdom)', () => {
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
