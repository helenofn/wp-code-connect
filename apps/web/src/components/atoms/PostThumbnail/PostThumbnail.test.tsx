import { fireEvent, render, screen } from '@testing-library/react'
import { PostThumbnail } from './PostThumbnail'

describe('PostThumbnail', () => {
  it('renders the image', () => {
    render(<PostThumbnail src="/thumbnails/project-1.png" alt="React zero to hero" />)
    expect(screen.getByRole('img', { name: 'React zero to hero' })).toHaveAttribute(
      'src',
      '/thumbnails/project-1.png',
    )
  })

  it('shows a placeholder when the post has no image', () => {
    render(<PostThumbnail src={null} alt="React zero to hero" />)
    expect(screen.getByRole('img', { name: 'React zero to hero (sem imagem)' })).toBeInTheDocument()
  })

  it('falls back to the placeholder when the image fails to load', () => {
    render(<PostThumbnail src="/quebrada.png" alt="Post" />)
    fireEvent.error(screen.getByRole('img', { name: 'Post' }))
    expect(screen.getByRole('img', { name: 'Post (sem imagem)' })).toBeInTheDocument()
  })

  it('tries again when the URL changes', () => {
    const { rerender } = render(<PostThumbnail src="/quebrada.png" alt="Post" />)
    fireEvent.error(screen.getByRole('img', { name: 'Post' }))
    rerender(<PostThumbnail src="/nova.png" alt="Post" />)
    expect(screen.getByRole('img', { name: 'Post' })).toHaveAttribute('src', '/nova.png')
  })
})
