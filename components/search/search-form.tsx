import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchForm({
  defaultValue,
  size = 'lg',
  className,
  hiddenFields,
}: {
  defaultValue?: string
  size?: 'lg' | 'md'
  className?: string
  hiddenFields?: Record<string, string | undefined>
}) {
  const large = size === 'lg'
  return (
    <form action="/chantiers" method="get" role="search" className={cn('w-full', className)}>
      <label htmlFor={`recherche-${size}`} className="sr-only">
        Rechercher par adresse, rue, ville ou code postal
      </label>
      {hiddenFields &&
        Object.entries(hiddenFields).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className={cn('flex w-full overflow-hidden rounded-md border-2 border-brand bg-background', large ? 'h-14' : 'h-12')}>
        <div className="flex flex-1 items-center gap-3 pl-4">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id={`recherche-${size}`}
            name="q"
            type="search"
            defaultValue={defaultValue}
            autoComplete="street-address"
            placeholder="Ex. : rue Saint-Denis, Laval, H2J"
            className={cn(
              'h-full w-full min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none',
              large ? 'text-base sm:text-lg' : 'text-base',
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            'shrink-0 bg-brand font-semibold text-brand-foreground transition-colors hover:bg-brand-deep focus-visible:outline-offset-[-4px]',
            large ? 'px-5 text-base sm:px-8' : 'px-5 text-sm',
          )}
        >
          Rechercher
        </button>
      </div>
    </form>
  )
}
