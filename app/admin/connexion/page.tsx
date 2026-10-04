import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/brand/logo'
import { LoginForm } from '@/components/admin/login-form'
import { ROLE_LABELS } from '@/lib/auth/permissions'
import { getSession } from '@/lib/auth/session'
import { DEMO_PASSWORD, SEED_USERS } from '@/lib/data/seed-admin'
import { SITE } from '@/lib/config'

export const metadata: Metadata = { title: 'Connexion à l’administration', robots: { index: false } }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suivant?: string }> }) {
  if (await getSession()) redirect('/admin')
  const { suivant } = await searchParams
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand p-10 text-brand-foreground lg:flex">
        <Logo variant="light" subtitle="Espace administration" />
        <div className="flex max-w-md flex-col gap-4">
          <p className="text-3xl leading-tight font-bold text-balance">
            Informer les riverains, chantier par chantier.
          </p>
          <p className="leading-relaxed text-brand-foreground/80">
            Publiez les avis d’entrave, tenez l’échéancier à jour et répondez aux questions des citoyens depuis un seul endroit.
          </p>
        </div>
        <p className="text-sm text-brand-foreground/70">{SITE.organization}</p>
      </div>
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="lg:hidden">
            <Logo subtitle="Espace administration" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground">Réservé aux équipes de projet et de communication.</p>
          </div>
          <LoginForm
            next={suivant}
            demoPassword={DEMO_PASSWORD}
            accounts={SEED_USERS.map((u) => ({ email: u.email, name: u.name, role: ROLE_LABELS[u.role] }))}
          />
          <Link href="/" className="text-sm font-medium text-brand hover:underline">
            Retour au site public
          </Link>
        </div>
      </main>
    </div>
  )
}
