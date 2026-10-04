'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useActionState, useRef } from 'react'
import { Field, describedBy, inputClass } from '@/components/forms/field'
import { submitQuestion, type FormState } from '@/lib/actions/public'
import { QUESTION_CATEGORY_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const initial: FormState = { ok: false }

export function QuestionForm({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [state, action, pending] = useActionState(submitQuestion, initial)
  const formRef = useRef<HTMLFormElement>(null)
  const e = state.errors ?? {}

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-md border border-success/30 bg-success-soft p-6">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          <p className="font-semibold">{state.message}</p>
        </div>
        <p className="text-sm text-foreground">
          Numéro de référence : <span className="font-mono font-semibold">{state.ref}</span>. Notre équipe vous
          répondra par courriel dans un délai de 2 jours ouvrables.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.message && !state.ok && (
        <p role="alert" className="rounded-md border border-signal/30 bg-danger-soft px-4 py-3 text-sm font-medium text-signal">
          {state.message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="q-name" label="Nom" required error={e.name}>
          <input id="q-name" name="name" autoComplete="name" required aria-invalid={!!e.name} aria-describedby={describedBy('q-name', { error: e.name })} className={inputClass} />
        </Field>
        <Field id="q-email" label="Courriel" required error={e.email}>
          <input id="q-email" name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} aria-describedby={describedBy('q-email', { error: e.email })} className={inputClass} />
        </Field>
        <Field id="q-phone" label="Téléphone" error={e.phone}>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!e.phone} aria-describedby={describedBy('q-phone', { error: e.phone })} className={inputClass} />
        </Field>
        <Field id="q-category" label="Sujet" required error={e.category}>
          <select id="q-category" name="category" required defaultValue="" aria-invalid={!!e.category} aria-describedby={describedBy('q-category', { error: e.category })} className={cn(inputClass, 'appearance-auto')}>
            <option value="" disabled>
              Choisir un sujet
            </option>
            {Object.entries(QUESTION_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="q-message" label="Votre question" required hint="Précisez votre adresse si votre question concerne votre propriété." error={e.message}>
        <textarea
          id="q-message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          aria-invalid={!!e.message}
          aria-describedby={describedBy('q-message', { hint: 'x', error: e.message })}
          className={cn(inputClass, 'h-auto py-2.5')}
        />
      </Field>
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-brand" aria-invalid={!!e.consent} aria-describedby={e.consent ? 'q-consent-error' : undefined} />
          <span>
            J’accepte que mes coordonnées soient utilisées uniquement pour répondre à ma question concernant le chantier «&nbsp;{projectName}&nbsp;».
          </span>
        </label>
        {e.consent && (
          <p id="q-consent-error" className="text-sm font-medium text-signal">
            {e.consent}
          </p>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 font-semibold text-brand-foreground transition-colors hover:bg-brand-deep disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {pending ? 'Envoi en cours' : 'Envoyer ma question'}
        </button>
      </div>
    </form>
  )
}
