import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('is associated with the field it describes', () => {
    render(
      <>
        <Label htmlFor="email">Email ou usuário</Label>
        <input id="email" />
      </>,
    )
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
  })
})
