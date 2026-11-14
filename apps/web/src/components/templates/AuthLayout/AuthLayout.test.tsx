import { render, screen } from '@testing-library/react'
import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders the banner and the content slot', () => {
    render(
      <AuthLayout bannerSrc="/banner-login.png" bannerAlt="Banner Code Connect">
        <p>Conteúdo do formulário</p>
      </AuthLayout>,
    )
    expect(screen.getByRole('img', { name: 'Banner Code Connect' })).toHaveAttribute(
      'src',
      '/banner-login.png',
    )
    expect(screen.getByText('Conteúdo do formulário')).toBeInTheDocument()
  })
})
