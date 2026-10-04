'use client'

import dynamic from 'next/dynamic'
import { STATUS_MAP_COLORS } from '@/components/project/badges'
import { STATUS_LABELS } from '@/lib/labels'
import type { ProjectStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { MapProject } from './types'

const Inner = dynamic(() => import('./projects-map-inner'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" />,
})

export function ProjectsMap({
  projects,
  single = false,
  className,
  label,
  showLegend = true,
}: {
  projects: MapProject[]
  single?: boolean
  className?: string
  label: string
  showLegend?: boolean
}) {
  return (
    <figure className={cn('relative overflow-hidden rounded-md border bg-muted', className)}>
      <div role="region" aria-label={label} className="size-full">
        <Inner projects={projects} single={single} className="size-full" />
      </div>
      {showLegend && (
        <figcaption className="pointer-events-none absolute bottom-2 left-2 z-[400] rounded-sm border bg-background/95 px-3 py-2 text-xs shadow-sm">
          <span className="sr-only">Légende : </span>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {(Object.keys(STATUS_MAP_COLORS) as ProjectStatus[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: STATUS_MAP_COLORS[s] }} aria-hidden="true" />
                {STATUS_LABELS[s]}
              </li>
            ))}
          </ul>
        </figcaption>
      )}
    </figure>
  )
}
