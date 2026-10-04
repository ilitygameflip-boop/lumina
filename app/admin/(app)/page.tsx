import Link from 'next/link'
import { AlertTriangle, ArrowRight, Plus } from 'lucide-react'
import { PageHeader, StatCard } from '@/components/admin/page-header'
import { TrafficChart } from '@/components/admin/traffic-chart'
import { StatusBadge } from '@/components/project/badges'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/permissions'
import { requirePermission } from '@/lib/auth/session'
import { getDashboardSummary, getMetrics, listActivity, listProjects, listQuestions } from '@/lib/data/repository'
import { formatDateTime, formatNumber, relativeDays } from '@/lib/format'
import { QUESTION_CATEGORY_LABELS } from '@/lib/labels'

export const metadata = { title: 'Tableau de bord' }

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ refus?: string }> }) {
  const user = await requirePermission('dashboard:view')
  const { refus } = await searchParams
  const [summary, metrics, activity, projects, questions] = await Promise.all([
    getDashboardSummary(),
    getMetrics(30),
    listActivity(8),
    listProjects({ includeUnpublished: true }),
    listQuestions({ status: 'nouvelle' }),
  ])
  const delta = summary.viewsPrev30 ? Math.round(((summary.views30 - summary.viewsPrev30) / summary.viewsPrev30) * 100) : 0
  const ending = projects
    .filter((p) => p.status === 'en_cours')
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, 4)

  return (
    <>
      {refus && (
        <p role="alert" className="flex items-center gap-2 rounded-md border border-signal/30 bg-danger-soft px-4 py-3 text-sm font-medium text-signal">
          <AlertTriangle className="size-4" aria-hidden="true" />
          Votre rôle ne permet pas d’accéder à cette page.
        </p>
      )}
      <PageHeader
        title={`Bonjour, ${user.name.split(' ')[0]}`}
        description="Vue d’ensemble des chantiers et de l’engagement citoyen."
        actions={
          can(user.role, 'project:create') && (
            <Button render={<Link href="/admin/chantiers/nouveau" />} nativeButton={false} className="h-10 bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="size-4" aria-hidden="true" />
              Nouveau chantier
            </Button>
          )
        }
      />

      <section aria-label="Indicateurs" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Chantiers en cours" value={summary.active} hint={`${summary.upcoming} à venir · ${summary.suspended} suspendu(s)`} />
        <StatCard label="Questions à traiter" value={summary.pendingQuestions} hint={`${summary.newQuestions} nouvelle(s)`} tone={summary.newQuestions ? 'alert' : 'default'} />
        <StatCard
          label="Consultations (30 j)"
          value={formatNumber(summary.views30)}
          hint={`${delta >= 0 ? '+' : ''}${delta} % vs 30 jours précédents`}
        />
        <StatCard label="Abonnés aux avis" value={formatNumber(summary.subscribers)} hint={`${summary.drafts} brouillon(s) non publié(s)`} />
      </section>

      <section aria-labelledby="trafic" className="rounded-md border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="trafic" className="font-semibold text-foreground">Fréquentation du portail, 30 derniers jours</h2>
          <Link href="/admin/statistiques" className="text-sm font-medium text-brand hover:underline">
            Statistiques détaillées
          </Link>
        </div>
        <TrafficChart data={metrics} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="nouvelles-questions" className="flex flex-col rounded-md border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="nouvelles-questions" className="font-semibold text-foreground">Nouvelles questions</h2>
            <Link href="/admin/questions" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Tout voir <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {questions.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Aucune nouvelle question. Beau travail.</p>
          ) : (
            <ul className="divide-y">
              {questions.slice(0, 5).map((q) => (
                <li key={q.id}>
                  <Link href={`/admin/questions?id=${q.id}`} className="flex flex-col gap-1 px-5 py-3 hover:bg-accent/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{q.ref}</span>
                      <span>·</span>
                      <span>{QUESTION_CATEGORY_LABELS[q.category]}</span>
                      {q.priority === 'haute' && <span className="rounded-sm bg-danger-soft px-1.5 font-semibold text-signal">Prioritaire</span>}
                    </div>
                    <p className="text-sm font-medium text-foreground">{q.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.name} · {formatDateTime(q.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="fin-prochaine" className="flex flex-col rounded-md border bg-card">
          <div className="border-b px-5 py-4">
            <h2 id="fin-prochaine" className="font-semibold text-foreground">Fins de chantier à venir</h2>
          </div>
          <ul className="divide-y">
            {ending.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/chantiers/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-accent/50">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.city}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-muted-foreground">{relativeDays(p.endDate)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="activite" className="rounded-md border bg-card">
        <h2 id="activite" className="border-b px-5 py-4 font-semibold text-foreground">Activité récente</h2>
        <ol className="divide-y">
          {activity.map((a) => (
            <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
              <p className="text-foreground">
                <span className="font-semibold">{a.actor}</span> {a.action}{' '}
                {a.href ? (
                  <Link href={a.href} className="font-medium text-brand hover:underline">
                    {a.target}
                  </Link>
                ) : (
                  <span className="font-medium">{a.target}</span>
                )}
              </p>
              <time dateTime={a.at} className="text-xs text-muted-foreground">
                {formatDateTime(a.at)}
              </time>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
