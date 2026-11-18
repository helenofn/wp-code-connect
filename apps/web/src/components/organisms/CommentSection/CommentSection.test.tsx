import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { aThread } from '../../../test/fixtures'
import { CommentSection } from './CommentSection'

function renderSection(canComment: boolean, onSubmit = vi.fn().mockResolvedValue(undefined)) {
  render(
    <MemoryRouter>
      <CommentSection threads={[aThread()]} canComment={canComment} onSubmit={onSubmit} />
    </MemoryRouter>,
  )
  return onSubmit
}

describe('CommentSection', () => {
  it('lets visitors read but not comment', () => {
    renderSection(false)
    expect(screen.getByRole('heading', { level: 2, name: 'Comentários' })).toBeInTheDocument()
    expect(screen.getByText(/Quanto tempo você levou/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Responder' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entre' })).toHaveAttribute('href', '/login')
  })

  it('shows and hides the replies', async () => {
    const user = userEvent.setup()
    renderSection(false)

    expect(screen.queryByText(/uns 3 dias/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver respostas (1)' }))
    expect(screen.getByText(/uns 3 dias/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ocultar respostas' }))
    expect(screen.queryByText(/uns 3 dias/)).not.toBeInTheDocument()
  })

  it('posts a new comment', async () => {
    const user = userEvent.setup()
    const onSubmit = renderSection(true)

    await user.type(screen.getByLabelText('Escreva um comentário'), '  Muito bom!  ')
    await user.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(onSubmit).toHaveBeenCalledWith('Muito bom!')
    expect(screen.getByLabelText('Escreva um comentário')).toHaveValue('')
  })

  it('replies inside the thread, mentioning the author', async () => {
    const user = userEvent.setup()
    const onSubmit = renderSection(true)

    await user.click(screen.getByRole('button', { name: 'Responder' }))
    const field = screen.getByLabelText('Responder a @gabriel_luz')
    expect(field).toHaveValue('@gabriel_luz ')
    await user.type(field, 'Valeu!')
    await user.click(screen.getByRole('button', { name: 'Enviar resposta' }))

    expect(onSubmit).toHaveBeenCalledWith('@gabriel_luz Valeu!', 'c1')
  })

  it('shows the error when posting fails', async () => {
    const user = userEvent.setup()
    renderSection(true, vi.fn().mockRejectedValue(new Error('Não foi possível conectar ao servidor.')))

    await user.type(screen.getByLabelText('Escreva um comentário'), 'Oi')
    await user.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível conectar ao servidor.')
  })
})
