export type Role = 'admin' | 'gestionnaire' | 'communication' | 'lecteur'

export type Permission =
  | 'dashboard:view'
  | 'project:create'
  | 'project:edit'
  | 'project:archive'
  | 'project:publish'
  | 'notice:manage'
  | 'question:manage'
  | 'stats:view'
  | 'users:manage'

export interface DemoUser {
  id: string
  name: string
  email: string
  title: string
  role: Role
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrateur',
  gestionnaire: 'Gestionnaire de projet',
  communication: 'Communication',
  lecteur: 'Lecteur',
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard:view',
    'project:create',
    'project:edit',
    'project:archive',
    'project:publish',
    'notice:manage',
    'question:manage',
    'stats:view',
    'users:manage',
  ],
  gestionnaire: [
    'dashboard:view',
    'project:create',
    'project:edit',
    'project:archive',
    'project:publish',
    'notice:manage',
    'question:manage',
    'stats:view',
  ],
  communication: ['dashboard:view', 'project:publish', 'notice:manage', 'question:manage', 'stats:view'],
  lecteur: ['dashboard:view', 'stats:view'],
}

export function can(role: Role | undefined, permission: Permission) {
  if (!role) return false
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function permissionsFor(role: Role) {
  return ROLE_PERMISSIONS[role]
}
