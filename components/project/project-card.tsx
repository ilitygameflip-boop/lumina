import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { ImpactMeter, StatusBadge } from '@/components/project/badges'
import { formatShortDate, progressPercent } from '@/lib/format'
import { WORK_TYPE_LABELS } from '@/lib/labels'
import type { Project } from '@/lib/types'

export function ProjectCard({ project, headingLevel = 'h3' }: { project: Project; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  const progress = project.status === 'termine' ? 100 : progressPercent(project.startDate, project.endDate)
  const showProgress = project.status === 'en_cours' || project.status === 'suspendu'

  return (
    <article className="group relative flex h-full flex-col rounded-md border bg-card transition-colors hover:border-brand/40">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={project.status} />
          <ImpactMeter level={project.impactLevel} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {WORK_TYPE_LABELS[project.workType]}
          </p>
          <Heading className="text-lg leading-snug font-semibold text-balance text-foreground">
            <Link
              href={`/chantiers/${project.slug}`}
              className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none group-has-[a:focus-visible]:ring-3 group-has-[a:focus-visible]:ring-ring/50"
            >
              {project.name}
            </Link>
          </Heading>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">{project.city}</span>
              {project.borough ? `, ${project.borough}` : ''}
            </span>
          </li>
          <li className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              {formatShortDate(project.startDate)} au {formatShortDate(project.endDate)}{' '}
              {project.endDate.slice(0, 4)}
            </span>
          </li>
        </ul>
        {showProgress && (
          <div className="mt-auto flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avancement estimé</span>
              <span className="font-mono font-medium">{progress} %</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 text-sm font-medium text-brand">
        <span>Voir le détail</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </article>
  )
}
