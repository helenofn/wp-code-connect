import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewPostForm } from './NewPostForm'

describe('NewPostForm', () => {
  it('previews the image only for a valid URL', async () => {
    const user = userEvent.setup()
    render(<NewPostForm onSubmit={vi.fn()} onDiscard={vi.fn()} />)

    expect(screen.getByRole('img', { name: 'Prévia da imagem do projeto (sem imagem)' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('URL da imagem (opcional)'), 'https://example.com/a.png')
    expect(screen.getByRole('img', { name: 'Prévia da imagem do projeto' })).toHaveAttribute(
      'src',
      'https://example.com/a.png',
    )
  })

  it('adds and removes tags, then submits the values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<NewPostForm onSubmit={onSubmit} onDiscard={vi.fn()} />)

    await user.type(screen.getByLabelText('Nome do projeto'), 'React zero to hero')
    await user.type(screen.getByLabelText('Descrição'), 'Do básico ao avançado')
    await user.type(screen.getByLabelText('Tags'), 'React{enter}Front-end,css{enter}')
    await user.click(screen.getByRole('button', { name: 'Remover tag css' }))
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'React zero to hero',
      description: 'Do básico ao avançado',
      code: '',
      thumbnailUrl: '',
      tags: ['react', 'front-end'],
    })
  })

  it('discards', async () => {
    const user = userEvent.setup()
    const onDiscard = vi.fn()
    render(<NewPostForm onSubmit={vi.fn()} onDiscard={onDiscard} />)
    await user.click(screen.getByRole('button', { name: 'Descartar' }))
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('disables Publicar while submitting and shows errors', () => {
    render(<NewPostForm onSubmit={vi.fn()} onDiscard={vi.fn()} submitting error="Verifique os dados informados." />)
    expect(screen.getByRole('button', { name: 'Publicando...' })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('Verifique os dados informados.')
  })
})
