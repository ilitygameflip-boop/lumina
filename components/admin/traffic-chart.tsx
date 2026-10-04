'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { DailyMetric } from '@/lib/types'

const config = {
  views: { label: 'Consultations', color: 'var(--brand)' },
  searches: { label: 'Recherches', color: 'var(--signal)' },
} satisfies ChartConfig

const fmt = new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export function TrafficChart({ data, className }: { data: DailyMetric[]; className?: string }) {
  return (
    <ChartContainer config={config} className={className ?? 'aspect-auto h-64 w-full'}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          minTickGap={32}
          tickFormatter={(v: string) => fmt.format(new Date(v))}
        />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => fmt.format(new Date(String(v)))} />} />
        <Area dataKey="views" type="monotone" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.12} strokeWidth={2} />
        <Area dataKey="searches" type="monotone" stroke="var(--color-searches)" fill="var(--color-searches)" fillOpacity={0.08} strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  )
}
