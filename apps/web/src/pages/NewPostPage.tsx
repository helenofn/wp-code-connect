import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Text } from '../components/atoms/Text/Text'
import { NewPostForm, type NewPostValues } from '../components/organisms/NewPostForm/NewPostForm'
import { getErrorMessage, getErrorStatus } from '../services/api/errors'
import { createPost } from '../services/api/posts'
import { useSession } from '../session/SessionContext'

/** Tela "Publicar": só para usuários logados; visitantes vão para o login e voltam. */
export function NewPostPage() {
  const navigate = useNavigate()
  const session = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  if (session.status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: '/publicar' }} />
  }
  if (session.status === 'loading') {
    return <Text variant="body">Carregando...</Text>
  }

  async function handleSubmit({ title, description, code, thumbnailUrl, tags }: NewPostValues) {
    setSubmitting(true)
    setError(undefined)
    try {
      const post = await createPost({
        title,
        description,
        code: code.trim() ? code : undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        tags,
      })
      navigate(`/posts/${post.id}`)
    } catch (err) {
      if (getErrorStatus(err) === 401) {
        session.signOut()
        return
      }
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <>
      <title>Publicar | Code Connect</title>
      <NewPostForm
        onSubmit={handleSubmit}
        onDiscard={() => navigate('/')}
        submitting={submitting}
        error={error}
      />
    </>
  )
}
