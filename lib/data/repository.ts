import 'server-only'

import { DEMO_TODAY } from '../config'
import { normalize, slugify } from '../format'
import type {
  ActivityEvent,
  DailyMetric,
  Project,
  ProjectFilters,
  ProjectInput,
  ProjectUpdate,
  Question,
  QuestionMessage,
  QuestionStatus,
  Subscription,
} from '../types'
import { SEED_PROJECTS } from './seed-projects'
import { SEED_ACTIVITY, SEED_QUESTIONS, buildMetrics } from './seed-admin'

/**
 * In-memory implementation of the data layer for Phase 1.
 * Every exported function is async and has the same signature a Postgres-backed
 * implementation will expose in Phase 2, so pages and actions never touch storage directly.
 */
interface Store {
  projects: Project[]
  questions: Question[]
  subscriptions: Subscription[]
  activity: ActivityEvent[]
  metrics: DailyMetric[]
}

const globalStore = globalThis as unknown as { __infoTravauxStore?: Store }

function store(): Store {
  if (!globalStore.__infoTravauxStore) {
    globalStore.__infoTravauxStore = {
      projects: structuredClone(SEED_PROJECTS),
      questions: structuredClone(SEED_QUESTIONS),
      subscriptions: [],
      activity: structuredClone(SEED_ACTIVITY),
      metrics: buildMetrics(DEMO_TODAY),
    }
  }
  return globalStore.__infoTravauxStore
}

function nowIso() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function matchesQuery(project: Project, query: string) {
  const q = normalize(query)
  if (!q) return true
  const haystack = normalize(
    [
      project.name,
      project.number,
      project.address,
      project.city,
      project.borough ?? '',
      ...project.streets,
      ...project.postalCodes,
    ].join(' '),
  )
  return q.split(' ').every((token) => haystack.includes(token))
}

const STATUS_ORDER: Record<Project['status'], number> = {
  en_cours: 0,
  suspendu: 1,
  planifie: 2,
  termine: 3,
}

export async function listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const { q, status, city, workType, impact, includeUnpublished } = filters
  return store()
    .projects.filter((p) => includeUnpublished || p.published)
    .filter((p) => !status || status === 'tous' || p.status === status)
    .filter((p) => !city || city === 'toutes' || p.city === city)
    .filter((p) => !workType || workType === 'tous' || p.workType === workType)
    .filter((p) => !impact || impact === 'tous' || p.impactLevel === impact)
    .filter((p) => !q || matchesQuery(p, q))
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.startDate.localeCompare(b.startDate))
}

export async function listCities(): Promise<string[]> {
  return [...new Set(store().projects.filter((p) => p.published).map((p) => p.city))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
}

export async function getProjectBySlug(slug: string, { includeUnpublished = false } = {}) {
  const project = store().projects.find((p) => p.slug === slug)
  if (!project || (!project.published && !includeUnpublished)) return null
  return project
}

export async function getProjectById(id: string) {
  return store().projects.find((p) => p.id === id) ?? null
}

export async function recordProjectView(id: string) {
  const project = store().projects.find((p) => p.id === id)
  if (project) project.views += 1
}

function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || 'chantier'
  let slug = root
  let i = 2
  while (store().projects.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${root}-${i++}`
  }
  return slug
}

export async function createProject(input: ProjectInput, actor: string): Promise<Project> {
  const now = nowIso()
  const project: Project = {
    ...input,
    id: uid('p'),
    slug: uniqueSlug(input.slug || `${input.name}-${input.city}`),
    updates: input.updates ?? [],
    updatedAt: now,
    publishedAt: input.published ? now : undefined,
    views: 0,
    subscribers: 0,
  }
  store().projects.unshift(project)
  logActivity(actor, input.published ? 'a publié le chantier' : 'a créé le brouillon', project.name, `/admin/chantiers/${project.id}`)
  return project
}

export async function updateProject(id: string, input: ProjectInput, actor: string): Promise<Project | null> {
  const s = store()
  const index = s.projects.findIndex((p) => p.id === id)
  if (index === -1) return null
  const current = s.projects[index]
  const next: Project = {
    ...current,
    ...input,
    slug: uniqueSlug(input.slug || current.slug, id),
    updates: input.updates ?? current.updates,
    updatedAt: nowIso(),
    publishedAt: input.published && !current.publishedAt ? nowIso() : current.publishedAt,
  }
  s.projects[index] = next
  logActivity(actor, 'a modifié', next.name, `/admin/chantiers/${id}`)
  return next
}

export async function setProjectPublished(id: string, published: boolean, actor: string) {
  const project = await getProjectById(id)
  if (!project) return null
  project.published = published
  project.updatedAt = nowIso()
  if (published && !project.publishedAt) project.publishedAt = nowIso()
  logActivity(actor, published ? 'a publié le chantier' : 'a retiré de la publication', project.name, `/admin/chantiers/${id}`)
  return project
}

export async function addProjectUpdate(
  projectId: string,
  update: Omit<ProjectUpdate, 'id' | 'publishedAt'>,
  actor: string,
) {
  const project = await getProjectById(projectId)
  if (!project) return null
  const entry: ProjectUpdate = { ...update, id: uid('u'), publishedAt: nowIso() }
  project.updates.unshift(entry)
  project.updatedAt = entry.publishedAt
  logActivity(
    actor,
    entry.status === 'publie' ? 'a publié un avis sur' : 'a enregistré un brouillon d’avis sur',
    project.name,
    `/admin/chantiers/${projectId}`,
  )
  return entry
}

export async function listAllUpdates() {
  return store()
    .projects.flatMap((p) => p.updates.map((u) => ({ ...u, project: { id: p.id, name: p.name, slug: p.slug, city: p.city } })))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function listQuestions(filters: { status?: QuestionStatus | 'toutes'; projectId?: string } = {}) {
  return store()
    .questions.filter((q) => !filters.status || filters.status === 'toutes' || q.status === filters.status)
    .filter((q) => !filters.projectId || q.projectId === filters.projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getQuestion(id: string) {
  return store().questions.find((q) => q.id === id) ?? null
}

export async function createQuestion(input: Omit<Question, 'id' | 'ref' | 'status' | 'createdAt' | 'messages' | 'priority'> & { body: string }) {
  const s = store()
  const nextNumber = Math.max(...s.questions.map((q) => Number(q.ref.slice(2))), 0) + 1
  const ref = `Q-${String(nextNumber).padStart(4, '0')}`
  const createdAt = nowIso()
  const { body, ...rest } = input
  const question: Question = {
    ...rest,
    id: `q-${nextNumber}`,
    ref,
    status: 'nouvelle',
    priority: input.category === 'dommages' ? 'haute' : 'normale',
    createdAt,
    messages: [{ id: uid('m'), author: input.name, authorType: 'citoyen', body, at: createdAt, internal: false }],
  }
  s.questions.unshift(question)
  const project = await getProjectById(input.projectId)
  logActivity(input.name, 'a posé une question sur', project?.name ?? 'un chantier', `/admin/questions?id=${question.id}`)
  return question
}

export async function replyToQuestion(
  id: string,
  message: Omit<QuestionMessage, 'id' | 'at'>,
  nextStatus: QuestionStatus,
) {
  const question = await getQuestion(id)
  if (!question) return null
  question.messages.push({ ...message, id: uid('m'), at: nowIso() })
  question.status = nextStatus
  if (!question.assignee) question.assignee = message.author
  if (!message.internal) logActivity(message.author, 'a répondu à la question', question.ref, `/admin/questions?id=${id}`)
  return question
}

export async function updateQuestionStatus(id: string, status: QuestionStatus, assignee?: string) {
  const question = await getQuestion(id)
  if (!question) return null
  question.status = status
  if (assignee) question.assignee = assignee
  return question
}

export async function createSubscription(projectId: string, email: string) {
  const s = store()
  const existing = s.subscriptions.find((sub) => sub.projectId === projectId && sub.email === email)
  if (existing) return { subscription: existing, alreadySubscribed: true }
  const subscription: Subscription = { id: uid('s'), projectId, email, createdAt: nowIso() }
  s.subscriptions.push(subscription)
  const project = await getProjectById(projectId)
  if (project) project.subscribers += 1
  return { subscription, alreadySubscribed: false }
}

function logActivity(actor: string, action: string, target: string, href?: string) {
  store().activity.unshift({ id: uid('a'), at: nowIso(), actor, action, target, href })
}

export async function listActivity(limit = 10) {
  return store().activity.slice(0, limit)
}

export async function getMetrics(days = 30) {
  return store().metrics.slice(-days)
}

export async function getDashboardSummary() {
  const s = store()
  const published = s.projects.filter((p) => p.published)
  const metrics30 = s.metrics.slice(-30)
  const previous30 = s.metrics.slice(-60, -30)
  const sum = (rows: DailyMetric[], key: keyof Omit<DailyMetric, 'date'>) => rows.reduce((acc, r) => acc + r[key], 0)
  return {
    active: published.filter((p) => p.status === 'en_cours').length,
    suspended: published.filter((p) => p.status === 'suspendu').length,
    upcoming: published.filter((p) => p.status === 'planifie').length,
    drafts: s.projects.filter((p) => !p.published).length,
    pendingQuestions: s.questions.filter((q) => q.status === 'nouvelle' || q.status === 'en_cours').length,
    newQuestions: s.questions.filter((q) => q.status === 'nouvelle').length,
    views30: sum(metrics30, 'views'),
    viewsPrev30: sum(previous30, 'views'),
    subscribers: s.projects.reduce((acc, p) => acc + p.subscribers, 0),
    searches30: sum(metrics30, 'searches'),
  }
}
