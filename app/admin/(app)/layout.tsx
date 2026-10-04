import type { Metadata } from 'next'
import { AdminMobileBar, AdminSidebar, type NavItem } from '@/components/admin/admin-nav'
import { can, ROLE_LABELS } from '@/lib/auth/permissions'
import { requireUser } from '@/lib/auth/session'
import { getDashboardSummary } from '@/lib/data/repository'

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s · Administration Info Travaux' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const summary = await getDashboardSummary()
  const items: NavItem[] = [
    { href: '/admin', label: 'Tableau de bord', icon: 'dashboard' },
    { href: '/admin/chantiers', label: 'Chantiers', icon: 'projects' },
    ...(can(user.role, 'notice:manage') ? [{ href: '/admin/avis', label: 'Avis', icon: 'notices' } as NavItem] : []),
    ...(can(user.role, 'question:manage')
      ? [{ href: '/admin/questions', label: 'Questions', icon: 'questions', badge: summary.newQuestions } as NavItem]
      : []),
    ...(can(user.role, 'stats:view') ? [{ href: '/admin/statistiques', label: 'Statistiques', icon: 'stats' } as NavItem] : []),
  ]
  const navUser = { name: user.name, role: ROLE_LABELS[user.role] }

  return (
    <div className="flex min-h-dvh bg-surface">
      <AdminSidebar items={items} user={navUser} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileBar items={items} user={navUser} />
        <main id="contenu" className="flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
