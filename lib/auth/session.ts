import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SEED_USERS } from '../data/seed-admin'
import { can, type DemoUser, type Permission } from './permissions'

/**
 * Phase 1 demo session. The cookie only stores a demo user id.
 * Phase 2 replaces this module with Better Auth while keeping getSession / requirePermission.
 */
export const SESSION_COOKIE = 'it_demo_session'

export async function getSession(): Promise<DemoUser | null> {
  const jar = await cookies()
  const id = jar.get(SESSION_COOKIE)?.value
  return SEED_USERS.find((u) => u.id === id) ?? null
}

export async function requireUser() {
  const user = await getSession()
  if (!user) redirect('/admin/connexion')
  return user
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser()
  if (!can(user.role, permission)) redirect('/admin?refus=1')
  return user
}

export async function assertPermission(permission: Permission) {
  const user = await getSession()
  if (!user || !can(user.role, permission)) {
    return { ok: false as const, error: 'Vous n’avez pas la permission d’effectuer cette action.' }
  }
  return { ok: true as const, user }
}
