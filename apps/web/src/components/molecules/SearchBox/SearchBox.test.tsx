import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { SearchBox } from './SearchBox'

function Controlled({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <SearchBox
      value={value}
      onChange={(v) => {
        setValue(v)
        onChange(v)
      }}
    />
  )
}

describe('SearchBox', () => {
  it('renders a labelled search field inside a search landmark', () => {
    render(<SearchBox value="" onChange={vi.fn()} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Buscar posts' })).toHaveAttribute(
      'placeholder',
      'Digite o que você procura',
    )
  })

  it('reports what the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    await user.type(screen.getByRole('searchbox'), 'react')
    expect(onChange).toHaveBeenLastCalledWith('react')
  })
})
