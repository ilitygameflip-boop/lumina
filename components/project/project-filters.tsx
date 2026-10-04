'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { IMPACT_LEVEL_LABELS, STATUS_LABELS, WORK_TYPE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const selectClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground appearance-auto focus-visible:border-ring'

export function ProjectFilters({ cities }: { cities: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (!value || value === 'tous' || value === 'toutes') next.delete(key)
    else next.set(key, value)
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }))
  }

  const hasFilters = ['statut', 'ville', 'type', 'impact', 'q'].some((k) => params.get(k))

  const fields: { key: string; label: string; all: string; options: [string, string][] }[] = [
    { key: 'statut', label: 'Statut', all: 'Tous les statuts', options: Object.entries(STATUS_LABELS) },
    { key: 'ville', label: 'Municipalité', all: 'Toutes', options: cities.map((c) => [c, c]) },
    { key: 'type', label: 'Type de travaux', all: 'Tous les types', options: Object.entries(WORK_TYPE_LABELS) },
    { key: 'impact', label: 'Impact', all: 'Tous les niveaux', options: Object.entries(IMPACT_LEVEL_LABELS) },
  ]

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end', pending && 'opacity-70')}>
      {fields.map((f) => (
        <div key={f.key} className="flex flex-col gap-1.5">
          <label htmlFor={`f-${f.key}`} className="text-sm font-medium text-foreground">
            {f.label}
          </label>
          <select id={`f-${f.key}`} value={params.get(f.key) ?? ''} onChange={(e) => update(f.key, e.target.value)} className={selectClass}>
            <option value="">{f.all}</option>
            {f.options.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="button"
        disabled={!hasFilters}
        onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
        className="h-10 rounded-md px-3 text-sm font-medium text-brand hover:bg-accent disabled:pointer-events-none disabled:text-muted-foreground"
      >
        Réinitialiser
      </button>
    </div>
  )
}
