import { render, screen } from '@testing-library/react'
import { CommentItem } from './CommentItem'

describe('CommentItem', () => {
  it('shows the author handle, the text and its actions', () => {
    render(
      <CommentItem authorName="Marcia Lima" username="marcia" body="Achei muito bom seu código!">
        <button type="button">Responder</button>
      </CommentItem>,
    )
    expect(screen.getByRole('article')).toHaveTextContent('@marciaAchei muito bom seu código!')
    expect(screen.getByRole('button', { name: 'Responder' })).toBeInTheDocument()
  })
})
