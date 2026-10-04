import Link from 'next/link'
import { ArrowRight, Bell, MessageSquare, Search } from 'lucide-react'
import { ProjectsMap } from '@/components/map/projects-map'
import { toMapProject } from '@/components/map/types'
import { ProjectCard } from '@/components/project/project-card'
import { SearchForm } from '@/components/search/search-form'
import { SITE } from '@/lib/config'
import { listCities, listProjects } from '@/lib/data/repository'

const STEPS = [
  { icon: Search, title: 'Trouvez votre secteur', body: 'Cherchez par rue, ville ou code postal pour voir les chantiers qui vous concernent.' },
  { icon: Bell, title: 'Recevez les avis', body: 'Abonnez-vous à un chantier pour être prévenu des fermetures et des interruptions d’eau.' },
  { icon: MessageSquare, title: 'Posez vos questions', body: 'Écrivez directement à l’équipe responsable. Réponse en 2 jours ouvrables.' },
]

export default async function HomePage() {
  const [projects, cities] = await Promise.all([listProjects(), listCities()])
  const active = projects.filter((p) => p.status === 'en_cours' || p.status === 'suspendu')
  const upcoming = projects.filter((p) => p.status === 'planifie')
  const featured = [...active, ...upcoming].slice(0, 6)

  return (
    <>
      <section className="border-b bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-16">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">{SITE.tagline}</p>
            <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              Des travaux près de chez vous&nbsp;? Sachez à quoi vous attendre.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
              Échéancier, entraves à la circulation, stationnement, interruptions d’eau&nbsp;: toute l’information sur
              les chantiers, mise à jour par les équipes sur le terrain.
            </p>
            <SearchForm className="max-w-xl" />
            <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              <div>
                <dt className="text-sm text-muted-foreground">Chantiers en cours</dt>
                <dd className="font-mono text-2xl font-semibold text-foreground">{active.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">À venir</dt>
                <dd className="font-mono text-2xl font-semibold text-foreground">{upcoming.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Municipalités</dt>
                <dd className="font-mono text-2xl font-semibold text-foreground">{cities.length}</dd>
              </div>
            </dl>
          </div>
          <ProjectsMap
            projects={projects.map(toMapProject)}
            label="Carte des chantiers au Québec"
            className="h-80 sm:h-[26rem] lg:h-[30rem]"
          />
        </div>
      </section>

      <section aria-labelledby="chantiers-actifs" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="chantiers-actifs" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Chantiers en cours et à venir
            </h2>
            <p className="text-muted-foreground">Les projets qui ont le plus d’effet sur vos déplacements.</p>
          </div>
          <Link
            href="/chantiers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            Voir tous les chantiers
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="comment" className="border-t bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 id="comment" className="mb-8 text-2xl font-bold tracking-tight text-foreground">
            Comment ça fonctionne
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-foreground">
                    <span className="sr-only">Étape {i + 1} : </span>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
