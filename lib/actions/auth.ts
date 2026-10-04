'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { SESSION_COOKIE } from '../auth/session'
import { DEMO_PASSWORD, SEED_USERS } from '../data/seed-admin'

export type LoginState = { error?: string; email?: string }

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  next: z.string().optional(),
})

function safeNext(next?: string) {
  return next && next.startsWith('/admin') && !next.startsWith('//') && !next.startsWith('/admin/connexion') ? next : '/admin'
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Entrez une adresse courriel et un mot de passe valides.', email: String(formData.get('email') ?? '') }
  const user = SEED_USERS.find((u) => u.email === parsed.data.email)
  if (!user || parsed.data.password !== DEMO_PASSWORD) {
    return { error: 'Courriel ou mot de passe incorrect.', email: parsed.data.email }
  }
  const jar = await cookies()
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  redirect(safeNext(parsed.data.next))
}

export async function logout() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect('/admin/connexion')
}
