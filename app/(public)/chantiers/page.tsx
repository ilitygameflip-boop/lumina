import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { List, Map as MapIcon, SearchX } from 'lucide-react'
import { ProjectsMap } from '@/components/map/projects-map'
import { toMapProject } from '@/components/map/types'
import { ProjectCard } from '@/components/project/project-card'
import { ProjectFilters } from '@/components/project/project-filters'
import { SearchForm } from '@/components/search/search-form'
import { listCities, listProjects } from '@/lib/data/repository'
import type { ImpactLevel, ProjectStatus, WorkType } from '@/lib/types'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tous les chantiers',
  description: 'Recherchez les chantiers d’infrastructures par rue, municipalité, statut ou type de travaux.',
}

type SP = Record<string, string | undefined>

export default async function ChantiersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const q = sp.q?.trim().slice(0, 100) || undefined
  const view = sp.vue === 'carte' ? 'carte' : 'liste'
  const [projects, cities] = await Promise.all([
    listProjects({
      q,
      status: sp.statut as ProjectStatus | undefined,
      city: sp.ville,
      workType: sp.type as WorkType | undefined,
      impact: sp.impact as ImpactLevel | undefined,
    }),
    listCities(),
  ])

  const viewHref = (v: 'liste' | 'carte') => {
    const next = new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => !!e[1]))
    if (v === 'liste') next.delete('vue')
    else next.set('vue', v)
    const s = next.toString()
    return `/chantiers${s ? `?${s}` : ''}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tous les chantiers</h1>
        <SearchForm
          size="md"
          defaultValue={q}
          className="max-w-2xl"
          hiddenFields={{ statut: sp.statut, ville: sp.ville, type: sp.type, impact: sp.impact, vue: sp.vue }}
        />
      </header>

      <section aria-label="Filtres" className="mb-6 rounded-md border bg-card p-4">
        <Suspense>
          <ProjectFilters cities={cities} />
        </Suspense>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{projects.length}</span>{' '}
          {projects.length > 1 ? 'chantiers trouvés' : 'chantier trouvé'}
          {q ? (
            <>
              {' '}
              pour «&nbsp;<span className="font-medium text-foreground">{q}</span>&nbsp;»
            </>
          ) : null}
        </p>
        <nav aria-label="Mode d’affichage" className="inline-flex rounded-md border bg-card p-0.5">
          {(['liste', 'carte'] as const).map((v) => {
            const Icon = v === 'liste' ? List : MapIcon
            const active = view === v
            return (
              <Link
                key={v}
                href={viewHref(v)}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-sm font-medium',
                  active ? 'bg-brand text-brand-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {v === 'liste' ? 'Liste' : 'Carte'}
              </Link>
            )
          })}
        </nav>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed px-6 py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">Aucun chantier ne correspond à votre recherche</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Vérifiez l’orthographe de la rue ou essayez avec le nom de la municipalité ou les trois premiers caractères du code postal.
          </p>
          <Link href="/chantiers" className="mt-2 text-sm font-semibold text-brand hover:underline">
            Afficher tous les chantiers
          </Link>
        </div>
      ) : view === 'carte' ? (
        <ProjectsMap projects={projects.map(toMapProject)} label="Carte des chantiers trouvés" className="h-[36rem]" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
