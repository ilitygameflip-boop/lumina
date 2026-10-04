'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/chantiers', label: 'Tous les chantiers' },
  { href: '/a-propos', label: 'À propos' },
]

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex h-16 items-center px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-brand',
                    'aria-[current=page]:text-brand aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-signal',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-10 px-4 text-sm sm:inline-flex"
            render={<Link href="/chantiers" />}
            nativeButton={false}
          >
            Trouver un chantier
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="size-11 md:hidden" aria-label="Ouvrir le menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Navigation mobile" className="px-4">
                <ul className="flex flex-col">
                  {[...NAV, { href: '/accessibilite', label: 'Accessibilité' }, { href: '/confidentialite', label: 'Confidentialité' }].map(
                    (item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                          className="flex min-h-12 items-center border-b text-base font-medium aria-[current=page]:text-brand"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
