import type {
  DocumentKind,
  ImpactCategory,
  ImpactLevel,
  PhaseStatus,
  ProjectStatus,
  QuestionCategory,
  QuestionStatus,
  UpdateType,
  WorkType,
} from './types'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planifie: 'À venir',
  en_cours: 'En cours',
  suspendu: 'Suspendu',
  termine: 'Terminé',
}

export const IMPACT_LEVEL_LABELS: Record<ImpactLevel, string> = {
  faible: 'Impact faible',
  modere: 'Impact modéré',
  eleve: 'Impact élevé',
}

export const SEVERITY_LABELS: Record<ImpactLevel, string> = {
  faible: 'Faible',
  modere: 'Modéré',
  eleve: 'Élevé',
}

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  reconstruction_chaussee: 'Reconstruction de chaussée',
  resurfacage: 'Resurfaçage',
  aqueduc_egouts: 'Aqueduc et égouts',
  structure: 'Structure et ouvrage d’art',
  trottoirs: 'Trottoirs et bordures',
  reamenagement: 'Réaménagement urbain',
}

export const IMPACT_CATEGORY_LABELS: Record<ImpactCategory, string> = {
  circulation: 'Circulation',
  stationnement: 'Stationnement',
  pietons: 'Piétons',
  cyclistes: 'Cyclistes',
  acces: 'Accès aux propriétés',
  transport_collectif: 'Transport collectif',
  bruit: 'Bruit et vibrations',
  eau: 'Eau potable',
  collectes: 'Collectes',
}

export const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  a_venir: 'À venir',
  en_cours: 'En cours',
  terminee: 'Terminée',
}

export const UPDATE_TYPE_LABELS: Record<UpdateType, string> = {
  avis: 'Avis aux résidents',
  mise_a_jour: 'Mise à jour',
  report: 'Report',
  fin: 'Fin des travaux',
}

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  avis: 'Avis',
  plan: 'Plan',
  carte: 'Carte',
  fiche: 'Fiche technique',
}

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  nouvelle: 'Nouvelle',
  en_cours: 'En traitement',
  repondue: 'Répondue',
  fermee: 'Fermée',
}

export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  circulation: 'Circulation et détours',
  stationnement: 'Stationnement',
  acces: 'Accès à ma propriété',
  bruit: 'Bruit et horaires',
  horaire: 'Échéancier',
  dommages: 'Dommages ou réclamation',
  autre: 'Autre',
}
