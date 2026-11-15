import { render, screen } from '@testing-library/react'
import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders the banner with the logo, the content slot and the footer', () => {
    render(
      <AuthLayout
        bannerSrc="/banners/login.webp"
        bannerAlt="Banner Code Connect"
        footer={<p>Rodapé</p>}
      >
        <p>Conteúdo do formulário</p>
      </AuthLayout>,
    )
    const banner = screen.getByRole('img', { name: 'Banner Code Connect' })
    expect(banner).toHaveAttribute('src', '/banners/login.webp')
    // O banner é o LCP da tela: precisa de prioridade alta.
    expect(banner).toHaveAttribute('fetchpriority', 'high')
    expect(screen.getByRole('img', { name: 'Code Connect' })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do formulário')).toBeInTheDocument()
    expect(screen.getByText('Rodapé')).toBeInTheDocument()
  })
})
