'use client'

import { Bell, CheckCircle2, Loader2 } from 'lucide-react'
import { useActionState } from 'react'
import { Field, describedBy, inputClass } from '@/components/forms/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { subscribeToProject, type FormState } from '@/lib/actions/public'
import { cn } from '@/lib/utils'

const initial: FormState = { ok: false }

function SubscribeForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(subscribeToProject, initial)
  const e = state.errors ?? {}

  if (state.ok) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-md bg-success-soft p-4 text-sm">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        <p>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      {state.message && (
        <p role="alert" className="text-sm font-medium text-signal">
          {state.message}
        </p>
      )}
      <Field id="s-email" label="Adresse courriel" required error={e.email}>
        <input id="s-email" name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} aria-describedby={describedBy('s-email', { error: e.email })} className={inputClass} />
      </Field>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-brand" aria-invalid={!!e.consent} />
        <span>J’accepte de recevoir les avis de ce chantier. Je peux me désabonner en tout temps.</span>
      </label>
      {e.consent && <p className="text-sm font-medium text-signal">{e.consent}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-deep disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        M’abonner
      </button>
    </form>
  )
}

export function SubscribeDialog({
  projectId,
  projectName,
  variant = 'primary',
}: {
  projectId: string
  projectName: string
  variant?: 'primary' | 'outline'
}) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors',
          variant === 'primary'
            ? 'bg-brand text-brand-foreground hover:bg-brand-deep'
            : 'border border-brand/30 bg-background text-brand hover:bg-accent',
        )}
      >
        <Bell className="size-4" aria-hidden="true" />
        Recevoir les avis
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recevoir les avis par courriel</DialogTitle>
          <DialogDescription>
            Soyez avisé des fermetures, interruptions d’eau et changements d’horaire pour «&nbsp;{projectName}&nbsp;».
          </DialogDescription>
        </DialogHeader>
        <SubscribeForm projectId={projectId} />
      </DialogContent>
    </Dialog>
  )
}
