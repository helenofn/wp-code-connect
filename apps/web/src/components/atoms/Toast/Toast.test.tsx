import { render, screen } from '@testing-library/react'
import { Toast } from './Toast'

describe('Toast', () => {
  it('announces the message in a status region', () => {
    render(<Toast message="Link copiado!" />)
    expect(screen.getByRole('status')).toHaveTextContent('Link copiado!')
  })

  it('keeps an empty live region without a message', () => {
    render(<Toast />)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
