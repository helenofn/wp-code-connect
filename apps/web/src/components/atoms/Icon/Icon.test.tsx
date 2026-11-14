import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders a decorative svg hidden from assistive tech', () => {
    const { container } = render(<Icon name="arrow-right" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
