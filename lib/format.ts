import { DEMO_TODAY } from './config'

const TZ = 'America/Toronto'

function toDate(value: string) {
  return value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  }).format(toDate(value))
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'short',
    timeZone: TZ,
  }).format(toDate(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  }).format(toDate(value))
}

export function formatRange(start: string, end: string) {
  return `${formatDate(start)} au ${formatDate(end)}`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-CA').format(value)
}

const DAY = 86_400_000

export function daysBetween(a: string, b: string) {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY)
}

export function progressPercent(start: string, end: string, today = DEMO_TODAY) {
  const total = daysBetween(start, end)
  if (total <= 0) return 100
  const elapsed = daysBetween(start, today)
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)))
}

export function relativeDays(target: string, today = DEMO_TODAY) {
  const diff = daysBetween(today, target)
  if (diff === 0) return 'aujourd’hui'
  if (diff === 1) return 'demain'
  if (diff === -1) return 'hier'
  if (diff > 0) return `dans ${diff} jours`
  return `il y a ${Math.abs(diff)} jours`
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function slugify(text: string) {
  return normalize(text).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
