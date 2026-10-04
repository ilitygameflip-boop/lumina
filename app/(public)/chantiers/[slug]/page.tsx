import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Clock, MapPin } from 'lucide-react'
import { ProjectsMap } from '@/components/map/projects-map'
import { toMapProject } from '@/components/map/types'
import { ImpactMeter, StatusBadge } from '@/components/project/badges'
import {
  ContactCard,
  DocumentsSection,
  ImpactsSection,
  PhasesSection,
  SectionHeading,
  UpdatesSection,
} from '@/components/project/detail-sections'
import { QuestionForm } from '@/components/project/question-form'
import { SubscribeDialog } from '@/components/project/subscribe-dialog'
import { getProjectBySlug, recordProjectView } from '@/lib/data/repository'
import { formatDate, formatRange, progressPercent } from '@/lib/format'
import { WORK_TYPE_LABELS } from '@/lib/labels'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Chantier introuvable' }
  return { title: project.name, description: project.summary }
}

const NAV = [
  ['impacts', 'Impacts'],
  ['echeancier', 'Échéancier'],
  ['avis', 'Avis'],
  ['documents', 'Documents'],
  ['question', 'Poser une question'],
] as const

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  await recordProjectView(project.id)

  const progress = project.status === 'termine' ? 100 : progressPercent(project.startDate, project.endDate)
  const facts: [string, React.ReactNode][] = [
    ['Période', <span key="p" className="font-mono">{formatRange(project.startDate, project.endDate)}</span>],
    ['Type de travaux', WORK_TYPE_LABELS[project.workType]],
    ['Heures de chantier', project.workHours],
    ['Travaux la fin de semaine', project.weekendWork ? 'Oui, possibles' : 'Non'],
    ['Donneur d’ouvrage', project.client],
    ['Numéro de projet', <span key="n" className="font-mono">{project.number}</span>],
  ]

  return (
    <article>
      <header className="border-b bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6">
          <Link href="/chantiers" className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand hover:underline">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Tous les chantiers
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <ImpactMeter level={project.impactLevel} />
            <span className="text-sm text-muted-foreground">Impact global</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              {project.name}
            </h1>
            <p className="inline-flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>
                {project.address} · <span className="font-medium text-foreground">{project.city}</span>
                {project.borough ? `, ${project.borough}` : ''}
              </span>
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-pretty text-foreground">{project.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SubscribeDialog projectId={project.id} projectName={project.name} />
            <a
              href="#question"
              className="inline-flex h-11 items-center rounded-md border border-brand/30 bg-background px-5 text-sm font-semibold text-brand hover:bg-accent"
            >
              Poser une question
            </a>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              Mis à jour le {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <nav aria-label="Sections de la page" className="-mt-2 flex gap-1 overflow-x-auto border-b pb-px">
            {NAV.filter(([id]) => id !== 'documents' || project.documents.length > 0).map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:border-brand hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          <ProjectsMap
            projects={[toMapProject(project)]}
            single
            showLegend={false}
            label={`Carte de la zone des travaux : ${project.address}`}
            className="h-72 sm:h-96"
          />

          <section aria-labelledby="description" className="flex flex-col gap-3">
            <SectionHeading id="description">À propos du projet</SectionHeading>
            <p className="leading-relaxed whitespace-pre-line text-foreground">{project.description}</p>
            {project.streets.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Rues touchées : </span>
                {project.streets.join(', ')}
              </p>
            )}
          </section>

          <ImpactsSection project={project} />
          <PhasesSection project={project} />
          <UpdatesSection project={project} />
          <DocumentsSection project={project} />

          <section aria-labelledby="question" className="flex flex-col gap-4">
            <SectionHeading id="question">Poser une question à l’équipe</SectionHeading>
            <p className="text-muted-foreground">
              Une question sur l’accès à votre propriété, le stationnement ou l’horaire&nbsp;? Écrivez-nous. Pour une
              urgence sur le chantier, appelez directement le responsable.
            </p>
            <div className="rounded-md border bg-card p-5 sm:p-6">
              <QuestionForm projectId={project.id} projectName={project.name} />
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          {project.status !== 'planifie' && (
            <div className="flex flex-col gap-2 rounded-md border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Avancement</h2>
                <span className="font-mono text-2xl font-semibold text-foreground">{progress} %</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement estimé">
                <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Estimation selon l’échéancier prévu.</p>
            </div>
          )}
          <dl className="flex flex-col divide-y rounded-md border bg-card">
            {facts.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 px-5 py-3">
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <ContactCard project={project} />
        </aside>
      </div>
    </article>
  )
}
