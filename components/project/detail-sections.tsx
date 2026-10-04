import { CheckCircle2, Circle, CircleDot, FileText, Mail, Phone } from 'lucide-react'
import { ImpactMeter } from '@/components/project/badges'
import { ImpactIcon } from '@/components/project/impact-icon'
import { formatDate, formatRange } from '@/lib/format'
import { DOCUMENT_KIND_LABELS, IMPACT_CATEGORY_LABELS, PHASE_STATUS_LABELS, UPDATE_TYPE_LABELS } from '@/lib/labels'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  )
}

export function ImpactsSection({ project }: { project: Project }) {
  return (
    <section aria-labelledby="impacts" className="flex flex-col gap-4">
      <SectionHeading id="impacts">Impacts sur votre quotidien</SectionHeading>
      <ul className="grid gap-3 md:grid-cols-2">
        {project.impacts.map((impact) => (
          <li key={impact.id} className="flex gap-4 rounded-md border bg-card p-4">
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-md',
                impact.severity === 'eleve' ? 'bg-danger-soft text-signal' : impact.severity === 'modere' ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success',
              )}
            >
              <ImpactIcon category={impact.category} className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {IMPACT_CATEGORY_LABELS[impact.category]}
                </p>
                <ImpactMeter level={impact.severity} />
              </div>
              <h3 className="font-semibold text-foreground">{impact.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{impact.details}</p>
              {impact.schedule && <p className="text-sm font-medium text-foreground">{impact.schedule}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function PhasesSection({ project }: { project: Project }) {
  const phases = [...project.phases].sort((a, b) => a.order - b.order)
  return (
    <section aria-labelledby="echeancier" className="flex flex-col gap-4">
      <SectionHeading id="echeancier">Échéancier des travaux</SectionHeading>
      <ol className="flex flex-col">
        {phases.map((phase, i) => {
          const Icon = phase.status === 'terminee' ? CheckCircle2 : phase.status === 'en_cours' ? CircleDot : Circle
          const last = i === phases.length - 1
          return (
            <li key={phase.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!last && <span className="absolute top-7 bottom-0 left-[11px] w-0.5 bg-border" aria-hidden="true" />}
              <Icon
                className={cn(
                  'relative z-10 mt-0.5 size-6 shrink-0 bg-background',
                  phase.status === 'terminee' ? 'text-success' : phase.status === 'en_cours' ? 'text-brand' : 'text-muted-foreground',
                )}
                aria-hidden="true"
              />
              <div className={cn('flex flex-1 flex-col gap-1 rounded-md', phase.status === 'en_cours' && 'border border-brand/30 bg-accent/60 p-4')}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold text-foreground">
                    Phase {phase.order} · {phase.name}
                  </h3>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{PHASE_STATUS_LABELS[phase.status]}</span>
                </div>
                <p className="font-mono text-sm text-foreground">{formatRange(phase.startDate, phase.endDate)}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function UpdatesSection({ project }: { project: Project }) {
  const updates = project.updates
    .filter((u) => u.status === 'publie')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  return (
    <section aria-labelledby="avis" className="flex flex-col gap-4">
      <SectionHeading id="avis">Avis et mises à jour</SectionHeading>
      {updates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun avis publié pour le moment.</p>
      ) : (
        <ol className="flex flex-col divide-y rounded-md border bg-card">
          {updates.map((u) => (
            <li key={u.id} className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span
                  className={cn(
                    'rounded-sm px-2 py-0.5 font-semibold',
                    u.type === 'avis' ? 'bg-danger-soft text-signal' : u.type === 'report' ? 'bg-warning-soft text-warning' : u.type === 'fin' ? 'bg-success-soft text-success' : 'bg-info-soft text-info',
                  )}
                >
                  {UPDATE_TYPE_LABELS[u.type]}
                </span>
                <time dateTime={u.publishedAt} className="text-muted-foreground">
                  Publié le {formatDate(u.publishedAt)}
                </time>
              </div>
              <h3 className="font-semibold text-foreground">{u.title}</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{u.body}</p>
              {u.validFrom && u.validTo && (
                <p className="text-sm font-medium text-foreground">En vigueur : {formatRange(u.validFrom, u.validTo)}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function DocumentsSection({ project }: { project: Project }) {
  if (project.documents.length === 0) return null
  return (
    <section aria-labelledby="documents" className="flex flex-col gap-4">
      <SectionHeading id="documents">Documents</SectionHeading>
      <ul className="grid gap-3 sm:grid-cols-2">
        {project.documents.map((d) => (
          <li key={d.id} className="flex gap-3 rounded-md border bg-card p-4">
            <FileText className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-foreground">{d.title}</p>
              <p className="text-sm text-muted-foreground">{d.description}</p>
              <p className="text-xs text-muted-foreground">
                {DOCUMENT_KIND_LABELS[d.kind]} · PDF, {d.pages} {d.pages > 1 ? 'pages' : 'page'} · {formatDate(d.publishedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ContactCard({ project }: { project: Project }) {
  const c = project.contact
  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-5">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Responsable des relations citoyennes</h2>
      <div>
        <p className="font-semibold text-foreground">{c.name}</p>
        <p className="text-sm text-muted-foreground">{c.role}</p>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        <li>
          <a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-2 font-medium text-brand hover:underline">
            <Phone className="size-4" aria-hidden="true" />
            {c.phone}
          </a>
        </li>
        <li>
          <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 font-medium break-all text-brand hover:underline">
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            {c.email}
          </a>
        </li>
      </ul>
    </div>
  )
}
