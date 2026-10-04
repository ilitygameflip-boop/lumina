import { IMPACT_LEVEL_LABELS, STATUS_LABELS } from '@/lib/labels'
import type { ImpactLevel, ProjectStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<ProjectStatus, { className: string; dot: string }> = {
  en_cours: { className: 'bg-info-soft text-info border-info/25', dot: 'bg-info' },
  planifie: { className: 'bg-muted text-foreground border-border', dot: 'bg-muted-foreground' },
  suspendu: { className: 'bg-warning-soft text-warning border-warning/30', dot: 'bg-warning' },
  termine: { className: 'bg-success-soft text-success border-success/25', dot: 'bg-success' },
}

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-sm border px-2 text-xs font-semibold whitespace-nowrap',
        style.className,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  faible: 'text-success',
  modere: 'text-warning',
  eleve: 'text-signal',
}

const IMPACT_BARS: Record<ImpactLevel, number> = { faible: 1, modere: 2, eleve: 3 }

export function ImpactMeter({ level, className, showLabel = true }: { level: ImpactLevel; className?: string; showLabel?: boolean }) {
  const filled = IMPACT_BARS[level]
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap', IMPACT_STYLES[level], className)}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn('w-1 rounded-[1px]', n <= filled ? 'bg-current' : 'bg-border')}
            style={{ height: `${6 + n * 3}px` }}
          />
        ))}
      </span>
      {showLabel ? <span>{IMPACT_LEVEL_LABELS[level]}</span> : <span className="sr-only">{IMPACT_LEVEL_LABELS[level]}</span>}
    </span>
  )
}

export const STATUS_MAP_COLORS: Record<ProjectStatus, string> = {
  en_cours: '#1d4f91',
  planifie: '#6b7280',
  suspendu: '#a15c07',
  termine: '#1f7a4d',
}
