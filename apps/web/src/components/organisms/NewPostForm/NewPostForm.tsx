import { useId, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Alert } from '../../atoms/Alert/Alert'
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { PostThumbnail } from '../../atoms/PostThumbnail/PostThumbnail'
import { FormField } from '../../molecules/FormField/FormField'
import { RemovableTag } from '../../molecules/RemovableTag/RemovableTag'
import { TextareaField } from '../../molecules/TextareaField/TextareaField'

export interface NewPostValues {
  title: string
  description: string
  code: string
  thumbnailUrl: string
  tags: string[]
}

interface NewPostFormProps {
  onSubmit: (values: NewPostValues) => void
  onDiscard: () => void
  submitting?: boolean
  error?: string
}

const MAX_TAGS = 5

/** Só URLs http(s) completas viram prévia (a API valida a mesma coisa). */
function previewUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

/**
 * Tela "Publicar" do Figma. A imagem do projeto entra por URL (no lugar do
 * botão "Carregar imagem"); sem ela, a prévia mostra o placeholder.
 */
export function NewPostForm({ onSubmit, onDiscard, submitting = false, error }: NewPostFormProps) {
  const tagsHintId = useId()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/,+$/, '')
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Uma tag digitada e não confirmada também vai junto.
    const pending = tagInput.trim().toLowerCase()
    const allTags = pending && !tags.includes(pending) ? [...tags, pending].slice(0, MAX_TAGS) : tags
    onSubmit({ title, description, code, thumbnailUrl: thumbnailUrl.trim(), tags: allTags })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-lg bg-cinza-escuro p-4 sm:p-8 xl:flex-row"
    >
      <div className="flex flex-col gap-4 xl:w-120 xl:shrink-0">
        <div className="rounded-lg bg-cinza-medio px-4 py-6">
          <div className="h-48 sm:h-80">
            <PostThumbnail src={previewUrl(thumbnailUrl)} alt={title.trim() || 'Prévia da imagem do projeto'} />
          </div>
        </div>
        <FormField
          label="URL da imagem (opcional)"
          name="thumbnailUrl"
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <h1 className="text-2xl/normal font-semibold text-offwhite">Novo projeto</h1>

        <div className="flex flex-col gap-6">
          <FormField
            label="Nome do projeto"
            name="title"
            required
            maxLength={120}
            placeholder="React zero to hero"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextareaField
            label="Descrição"
            name="description"
            required
            maxLength={2000}
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextareaField
            label="Código (opcional)"
            name="code"
            mono
            rows={6}
            maxLength={10000}
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex flex-col gap-4">
            <FormField
              label="Tags"
              name="tags"
              placeholder={tags.length >= MAX_TAGS ? 'Limite de tags atingido' : 'React'}
              disabled={tags.length >= MAX_TAGS}
              aria-describedby={tagsHintId}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
            />
            <p id={tagsHintId} className="text-xs/normal text-cinza-medio">
              Tecle Enter ou vírgula para adicionar. Até {MAX_TAGS} tags.
            </p>
            {tags.length > 0 && (
              <ul aria-label="Tags do projeto" className="flex flex-wrap gap-4">
                {tags.map((tag) => (
                  <li key={tag}>
                    <RemovableTag
                      label={tag}
                      removeLabel={`Remover tag ${tag}`}
                      onRemove={() => setTags(tags.filter((t) => t !== tag))}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <Alert>{error}</Alert>}

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button type="button" variant="outline" onClick={onDiscard} icon={<Icon name="delete" />}>
            Descartar
          </Button>
          <Button type="submit" disabled={submitting} aria-busy={submitting} icon={<Icon name="publish" />}>
            {submitting ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </div>
    </form>
  )
}
