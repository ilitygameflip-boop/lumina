import { cn } from '@/lib/utils'

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-signal" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> (facultatif)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-signal">
          {error}
        </p>
      )}
    </div>
  )
}

export function describedBy(id: string, { hint, error }: { hint?: string; error?: string }) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

export const inputClass =
  'h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground aria-invalid:border-signal focus-visible:border-ring'
