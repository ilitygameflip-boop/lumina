export type ProjectStatus = 'planifie' | 'en_cours' | 'suspendu' | 'termine'
export type ImpactLevel = 'faible' | 'modere' | 'eleve'
export type WorkType =
  | 'reconstruction_chaussee'
  | 'resurfacage'
  | 'aqueduc_egouts'
  | 'structure'
  | 'trottoirs'
  | 'reamenagement'
export type ImpactCategory =
  | 'circulation'
  | 'stationnement'
  | 'pietons'
  | 'cyclistes'
  | 'acces'
  | 'transport_collectif'
  | 'bruit'
  | 'eau'
  | 'collectes'
export type PhaseStatus = 'a_venir' | 'en_cours' | 'terminee'
export type UpdateType = 'avis' | 'mise_a_jour' | 'report' | 'fin'
export type DocumentKind = 'avis' | 'plan' | 'carte' | 'fiche'

export interface Impact {
  id: string
  category: ImpactCategory
  severity: ImpactLevel
  title: string
  details: string
  schedule?: string
}

export interface Phase {
  id: string
  order: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: PhaseStatus
}

export interface ProjectUpdate {
  id: string
  type: UpdateType
  title: string
  body: string
  publishedAt: string
  validFrom?: string
  validTo?: string
  author: string
  status: 'publie' | 'brouillon'
}

export interface ProjectDocument {
  id: string
  kind: DocumentKind
  title: string
  description: string
  pages: number
  publishedAt: string
}

export interface ProjectContact {
  name: string
  role: string
  email: string
  phone: string
}

export interface Project {
  id: string
  slug: string
  number: string
  name: string
  summary: string
  description: string
  city: string
  borough?: string
  address: string
  streets: string[]
  postalCodes: string[]
  lat: number
  lng: number
  zone: [number, number][]
  workType: WorkType
  status: ProjectStatus
  impactLevel: ImpactLevel
  startDate: string
  endDate: string
  workHours: string
  weekendWork: boolean
  client: string
  contact: ProjectContact
  impacts: Impact[]
  phases: Phase[]
  updates: ProjectUpdate[]
  documents: ProjectDocument[]
  published: boolean
  publishedAt?: string
  updatedAt: string
  nextUpdateAt?: string
  views: number
  subscribers: number
}

export type QuestionStatus = 'nouvelle' | 'en_cours' | 'repondue' | 'fermee'
export type QuestionCategory =
  | 'circulation'
  | 'stationnement'
  | 'acces'
  | 'bruit'
  | 'horaire'
  | 'dommages'
  | 'autre'

export interface QuestionMessage {
  id: string
  author: string
  authorType: 'citoyen' | 'equipe'
  body: string
  at: string
  internal: boolean
}

export interface Question {
  id: string
  ref: string
  projectId: string
  name: string
  email: string
  phone?: string
  category: QuestionCategory
  subject: string
  status: QuestionStatus
  priority: 'normale' | 'haute'
  createdAt: string
  assignee?: string
  messages: QuestionMessage[]
}

export interface Subscription {
  id: string
  projectId: string
  email: string
  createdAt: string
}

export interface ActivityEvent {
  id: string
  at: string
  actor: string
  action: string
  target: string
  href?: string
}

export interface DailyMetric {
  date: string
  views: number
  searches: number
  questions: number
  subscriptions: number
}

export type ProjectInput = Omit<
  Project,
  'id' | 'updatedAt' | 'views' | 'subscribers' | 'publishedAt' | 'updates'
> & { updates?: ProjectUpdate[] }

export interface ProjectFilters {
  q?: string
  status?: ProjectStatus | 'tous'
  city?: string
  workType?: WorkType | 'tous'
  impact?: ImpactLevel | 'tous'
  includeUnpublished?: boolean
}
