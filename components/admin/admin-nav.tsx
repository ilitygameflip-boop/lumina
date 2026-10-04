'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, ExternalLink, HardHat, LayoutDashboard, LogOut, Megaphone, Menu, MessageSquare } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { logout } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const ICONS = { dashboard: LayoutDashboard, projects: HardHat, notices: Megaphone, questions: MessageSquare, stats: BarChart3 }

export interface NavItem {
  href: string
  label: string
  icon: keyof typeof ICONS
  badge?: number
}

interface Props {
  items: NavItem[]
  user: { name: string; role: string }
}

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                active ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/6 hover:text-white',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-sm bg-signal px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
                  {item.badge}
                  <span className="sr-only"> nouvelles</span>
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function SidebarBody({ items, user, onNavigate }: Props & { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-brand p-4 text-white">
      <div className="px-2 pt-2">
        <Logo href="/admin" variant="light" subtitle="Administration" />
      </div>
      <nav aria-label="Administration" className="flex-1">
        <NavList items={items} onNavigate={onNavigate} />
      </nav>
      <div className="flex flex-col gap-1 border-t border-white/15 pt-4">
        <Link href="/" target="_blank" className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-white/70 hover:bg-white/6 hover:text-white">
          <ExternalLink className="size-4" aria-hidden="true" />
          Voir le site public
          <span className="sr-only"> (nouvel onglet)</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold" aria-hidden="true">
            {user.name
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-white/60">{user.role}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="flex size-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white" aria-label="Se déconnecter">
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function AdminSidebar(props: Props) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
      <SidebarBody {...props} />
    </aside>
  )
}

export function AdminMobileBar(props: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-brand px-4 lg:hidden">
      <Logo href="/admin" variant="light" subtitle="Administration" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="size-10 text-white hover:bg-white/10 hover:text-white" aria-label="Ouvrir le menu" />}>
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu d’administration</SheetTitle>
          </SheetHeader>
          <SidebarBody {...props} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
