import type { ActivityEvent, DailyMetric, Question } from '../types'
import type { DemoUser } from '../auth/permissions'

export const SEED_USERS: DemoUser[] = [
  { id: 'usr-1', name: 'Isabelle Gauthier', email: 'admin@demo.infotravaux.ca', title: 'Directrice des communications', role: 'admin' },
  { id: 'usr-2', name: 'Marc-André Gagnon', email: 'gestion@demo.infotravaux.ca', title: 'Chargé de projet', role: 'gestionnaire' },
  { id: 'usr-3', name: 'Julie Tremblay', email: 'communication@demo.infotravaux.ca', title: 'Agente de liaison avec le milieu', role: 'communication' },
  { id: 'usr-4', name: 'Philippe Bergeron', email: 'lecture@demo.infotravaux.ca', title: 'Analyste, ville partenaire', role: 'lecteur' },
]

export const DEMO_PASSWORD = 'demo2026'

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'q-128', ref: 'Q-0128', projectId: 'p-001', name: 'Hélène Dubois', email: 'h.dubois@exemple.com', category: 'acces',
    subject: 'Accès à mon garage pendant la coulée des trottoirs', status: 'nouvelle', priority: 'haute', createdAt: '2026-10-03T19:42:00',
    messages: [{ id: 'm-1', author: 'Hélène Dubois', authorType: 'citoyen', at: '2026-10-03T19:42:00', internal: false, body: 'Bonjour, j’habite au 4288 Saint-Denis et mon garage donne sur le trottoir ouest. Pourrai-je sortir ma voiture entre le 5 et le 16 octobre? Je dois me rendre à des rendez-vous médicaux.' }],
  },
  {
    id: 'q-127', ref: 'Q-0127', projectId: 'p-009', name: 'Kevin Nguyen', email: 'k.nguyen@exemple.com', category: 'bruit',
    subject: 'Travaux de nuit et sommeil', status: 'nouvelle', priority: 'normale', createdAt: '2026-10-03T16:10:00',
    messages: [{ id: 'm-2', author: 'Kevin Nguyen', authorType: 'citoyen', at: '2026-10-03T16:10:00', internal: false, body: 'Combien de nuits exactement les travaux auront-ils lieu devant le 4510 Papineau? Je travaille tôt le matin.' }],
  },
  {
    id: 'q-126', ref: 'Q-0126', projectId: 'p-003', name: 'Martine Leclerc', email: 'mleclerc@exemple.com', category: 'stationnement',
    subject: 'Vignette pour le stationnement du Musée', status: 'en_cours', priority: 'normale', createdAt: '2026-10-02T10:05:00', assignee: 'Julie Tremblay',
    messages: [
      { id: 'm-3', author: 'Martine Leclerc', authorType: 'citoyen', at: '2026-10-02T10:05:00', internal: false, body: 'Où puis-je obtenir la vignette temporaire donnant accès au stationnement du Musée national?' },
      { id: 'm-4', author: 'Julie Tremblay', authorType: 'equipe', at: '2026-10-02T14:20:00', internal: true, body: 'Vérifier avec la Ville de Québec si les vignettes sont encore distribuées au bureau d’arrondissement.' },
    ],
  },
  {
    id: 'q-125', ref: 'Q-0125', projectId: 'p-002', name: 'Robert Lessard', email: 'rlessard@exemple.com', category: 'horaire',
    subject: 'Date du pavage final', status: 'repondue', priority: 'normale', createdAt: '2026-09-30T08:30:00', assignee: 'Marc-André Gagnon',
    messages: [
      { id: 'm-5', author: 'Robert Lessard', authorType: 'citoyen', at: '2026-09-30T08:30:00', internal: false, body: 'Quand aura lieu le pavage final devant le 1450 de la Concorde?' },
      { id: 'm-6', author: 'Marc-André Gagnon', authorType: 'equipe', at: '2026-09-30T13:12:00', internal: false, body: 'Bonjour M. Lessard, le pavage final est prévu de nuit entre le 19 et le 23 octobre, selon la météo. Un avis sera publié sur la fiche du chantier.' },
    ],
  },
  {
    id: 'q-124', ref: 'Q-0124', projectId: 'p-001', name: 'Café Le Gilford', email: 'info@cafegilford.exemple.com', category: 'acces',
    subject: 'Livraisons pour les commerces', status: 'en_cours', priority: 'haute', createdAt: '2026-09-29T09:00:00', assignee: 'Julie Tremblay',
    messages: [{ id: 'm-7', author: 'Café Le Gilford', authorType: 'citoyen', at: '2026-09-29T09:00:00', internal: false, body: 'Nos livraisons arrivent le mardi matin. Y a-t-il une zone de livraison temporaire prévue?' }],
  },
  {
    id: 'q-123', ref: 'Q-0123', projectId: 'p-008', name: 'Jacques Morin', email: 'jmorin@exemple.com', category: 'horaire',
    subject: 'Reprise des travaux', status: 'repondue', priority: 'normale', createdAt: '2026-09-26T11:00:00', assignee: 'Isabelle Gauthier',
    messages: [
      { id: 'm-8', author: 'Jacques Morin', authorType: 'citoyen', at: '2026-09-26T11:00:00', internal: false, body: 'Les feux temporaires resteront-ils en place pendant la suspension?' },
      { id: 'm-9', author: 'Isabelle Gauthier', authorType: 'equipe', at: '2026-09-26T15:40:00', internal: false, body: 'Oui, la circulation en alternance est maintenue pour des raisons de sécurité jusqu’à la reprise prévue vers le 13 octobre.' },
    ],
  },
  {
    id: 'q-122', ref: 'Q-0122', projectId: 'p-005', name: 'Annie Paquette', email: 'apaquette@exemple.com', category: 'dommages',
    subject: 'Fissure sur mon entrée', status: 'fermee', priority: 'normale', createdAt: '2026-09-20T09:00:00', assignee: 'Isabelle Gauthier',
    messages: [
      { id: 'm-10', author: 'Annie Paquette', authorType: 'citoyen', at: '2026-09-20T09:00:00', internal: false, body: 'Une fissure est apparue dans mon entrée après les travaux. Comment faire une réclamation?' },
      { id: 'm-11', author: 'Isabelle Gauthier', authorType: 'equipe', at: '2026-09-21T10:00:00', internal: false, body: 'Nous avons transmis votre demande à notre service des réclamations, qui communiquera avec vous sous 5 jours ouvrables.' },
    ],
  },
]

export const SEED_ACTIVITY: ActivityEvent[] = [
  { id: 'a-1', at: '2026-10-03T19:42:00', actor: 'Hélène Dubois', action: 'a posé une question sur', target: 'Reconstruction de la rue Saint-Denis', href: '/admin/questions?id=q-128' },
  { id: 'a-2', at: '2026-10-03T09:15:00', actor: 'Julie Tremblay', action: 'a publié un avis sur', target: 'Resurfaçage de l’avenue Papineau', href: '/admin/chantiers/p-009' },
  { id: 'a-3', at: '2026-10-02T14:30:00', actor: 'Julie Tremblay', action: 'a publié un avis sur', target: 'Reconstruction de la rue Saint-Denis', href: '/admin/chantiers/p-001' },
  { id: 'a-4', at: '2026-10-02T10:00:00', actor: 'Julie Tremblay', action: 'a créé le brouillon', target: 'Réfection de la rue Wellington', href: '/admin/chantiers/p-010' },
  { id: 'a-5', at: '2026-10-01T16:00:00', actor: 'Marc-André Gagnon', action: 'a publié une mise à jour sur', target: 'Réfection du boulevard de la Concorde Est', href: '/admin/chantiers/p-002' },
  { id: 'a-6', at: '2026-10-01T08:30:00', actor: 'Louis Pelletier', action: 'a publié une mise à jour sur', target: 'Reconstruction des trottoirs de la rue des Forges', href: '/admin/chantiers/p-007' },
  { id: 'a-7', at: '2026-09-30T13:12:00', actor: 'Marc-André Gagnon', action: 'a répondu à la question', target: 'Q-0125', href: '/admin/questions?id=q-125' },
]

function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function buildMetrics(endDate: string, days = 90): DailyMetric[] {
  const rand = seededRandom(42)
  const end = new Date(`${endDate}T12:00:00`)
  const out: DailyMetric[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86_400_000)
    const weekday = d.getDay()
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.55 : 1
    const trend = 1 + (days - i) / days
    const views = Math.round((120 + rand() * 90) * trend * weekendFactor)
    out.push({
      date: d.toISOString().slice(0, 10),
      views,
      searches: Math.round(views * (0.35 + rand() * 0.15)),
      questions: Math.round(rand() * 4 * weekendFactor),
      subscriptions: Math.round((2 + rand() * 6) * weekendFactor),
    })
  }
  return out
}
