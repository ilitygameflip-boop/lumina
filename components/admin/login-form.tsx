'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { login, type LoginState } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DemoAccount {
  email: string
  name: string
  role: string
}

export function LoginForm({ next, accounts, demoPassword }: { next?: string; accounts: DemoAccount[]; demoPassword: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})
  const [email, setEmail] = useState(state.email ?? '')
  const [password, setPassword] = useState('')

  return (
    <div className="flex flex-col gap-8">
      <form action={action} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="next" value={next ?? ''} />
        {state.error && (
          <p role="alert" className="flex items-start gap-2 rounded-md bg-danger-soft p-3 text-sm font-medium text-signal">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.error}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Adresse courriel</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
        </div>
        <Button type="submit" disabled={pending} className="h-11 bg-brand text-brand-foreground hover:bg-brand/90">
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Se connecter
        </Button>
      </form>

      <section aria-labelledby="demo-accounts" className="flex flex-col gap-3 rounded-md border border-dashed bg-surface p-4">
        <div>
          <h2 id="demo-accounts" className="text-sm font-semibold text-foreground">Comptes de démonstration</h2>
          <p className="text-xs text-muted-foreground">
            Mot de passe : <span className="font-mono font-semibold text-foreground">{demoPassword}</span>. Choisissez un rôle pour remplir le formulaire.
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {accounts.map((a) => (
            <li key={a.email}>
              <button
                type="button"
                onClick={() => {
                  setEmail(a.email)
                  setPassword(demoPassword)
                }}
                className="flex w-full flex-col items-start rounded-md border bg-card px-3 py-2 text-left hover:border-brand/50 hover:bg-accent"
              >
                <span className="text-sm font-semibold text-foreground">{a.role}</span>
                <span className="text-xs text-muted-foreground">{a.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
