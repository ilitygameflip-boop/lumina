import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8 shrink-0', className)}>
      <rect width="32" height="32" rx="4" fill="currentColor" />
      <path d="M7 22h18" stroke="var(--signal)" strokeWidth="3" strokeLinecap="square" />
      <path d="M9 18V10h4M16 18v-8M20 10h4v8" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="square" />
    </svg>
  )
}

export function Logo({
  href = '/',
  variant = 'dark',
  subtitle = 'Information sur les chantiers',
}: {
  href?: string
  variant?: 'dark' | 'light'
  subtitle?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-sm',
        variant === 'dark' ? 'text-brand' : 'text-white',
      )}
    >
      <LogoMark className={variant === 'light' ? 'text-white/10' : undefined} />
      <span className="flex flex-col leading-none">
        <span className={cn('text-base font-bold tracking-tight', variant === 'dark' ? 'text-brand' : 'text-white')}>
          Info Travaux
        </span>
        <span className={cn('mt-1 text-xs', variant === 'dark' ? 'text-muted-foreground' : 'text-white/70')}>
          {subtitle}
        </span>
      </span>
    </Link>
  )
}
