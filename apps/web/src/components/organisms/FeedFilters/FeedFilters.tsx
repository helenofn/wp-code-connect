import { Tag } from '../../atoms/Tag/Tag'
import { RemovableTag } from '../../molecules/RemovableTag/RemovableTag'
import { SearchBox } from '../../molecules/SearchBox/SearchBox'

interface FeedFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  /** Tags filtrando o feed. */
  tags: string[]
  onRemoveTag: (tag: string) => void
  /** Tags sugeridas para adicionar ao filtro. */
  suggestedTags?: string[]
  onAddTag: (tag: string) => void
  onClear: () => void
}

/** Bloco "Busca" do Figma: campo de busca, tags do filtro e "Limpar tudo". */
export function FeedFilters({
  query,
  onQueryChange,
  tags,
  onRemoveTag,
  suggestedTags = [],
  onAddTag,
  onClear,
}: FeedFiltersProps) {
  const hasFilters = query.trim() !== '' || tags.length > 0
  return (
    <div className="flex flex-col gap-4">
      <SearchBox value={query} onChange={onQueryChange} />
      {(tags.length > 0 || suggestedTags.length > 0 || hasFilters) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul aria-label="Filtros por tag" className="flex flex-wrap items-center gap-4 sm:gap-6">
            {tags.map((tag) => (
              <li key={tag}>
                <RemovableTag
                  label={tag}
                  removeLabel={`Remover filtro ${tag}`}
                  onRemove={() => onRemoveTag(tag)}
                />
              </li>
            ))}
            {suggestedTags.map((tag) => (
              <li key={tag}>
                <Tag onClick={() => onAddTag(tag)} label={`Filtrar por ${tag}`}>
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="rounded text-lg/normal text-cinza-medio transition hover:text-offwhite focus-visible:outline-2 focus-visible:outline-verde-destaque"
            >
              Limpar tudo
            </button>
          )}
        </div>
      )}
    </div>
  )
}
