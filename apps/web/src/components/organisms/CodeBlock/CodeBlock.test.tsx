import { render, screen } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'

describe('CodeBlock', () => {
  it('shows the code under its heading, preserving line breaks', () => {
    const code = 'const a = 1\nconst b = 2'
    render(<CodeBlock code={code} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Código:' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Código:' }).querySelector('code')?.textContent).toBe(code)
  })
})
