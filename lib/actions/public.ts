'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createQuestion, createSubscription, getProjectById } from '@/lib/data/repository'

export type FormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
  ref?: string
}

const questionSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(2, 'Indiquez votre nom.').max(120),
  email: z.string().trim().email('Adresse courriel invalide.').max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9 ()+.-]*$/, 'Numéro de téléphone invalide.')
    .optional()
    .or(z.literal('')),
  category: z.enum(['circulation', 'stationnement', 'acces', 'bruit', 'horaire', 'dommages', 'autre'], {
    message: 'Choisissez un sujet.',
  }),
  message: z.string().trim().min(10, 'Votre message doit contenir au moins 10 caractères.').max(2000),
  consent: z.literal('on', { message: 'Vous devez accepter pour envoyer votre question.' }),
  website: z.string().max(0).optional(),
})

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}

export async function submitQuestion(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = questionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Veuillez corriger les champs indiqués.', errors: fieldErrors(parsed.error) }
  }
  const project = await getProjectById(parsed.data.projectId)
  if (!project || !project.published) return { ok: false, message: 'Ce chantier est introuvable.' }

  const { name, email, phone, category, message } = parsed.data
  const question = await createQuestion({
    projectId: project.id,
    name,
    email,
    phone: phone || undefined,
    category,
    subject: message.slice(0, 80),
    body: message,
  })
  revalidatePath('/admin', 'layout')
  return { ok: true, ref: question.ref, message: 'Votre question a bien été transmise.' }
}

const subscribeSchema = z.object({
  projectId: z.string().min(1),
  email: z.string().trim().email('Adresse courriel invalide.').max(200),
  consent: z.literal('on', { message: 'Votre consentement est requis.' }),
})

export async function subscribeToProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Veuillez corriger les champs indiqués.', errors: fieldErrors(parsed.error) }
  }
  const project = await getProjectById(parsed.data.projectId)
  if (!project || !project.published) return { ok: false, message: 'Ce chantier est introuvable.' }
  const { alreadySubscribed } = await createSubscription(project.id, parsed.data.email.toLowerCase())
  return {
    ok: true,
    message: alreadySubscribed
      ? 'Cette adresse est déjà abonnée aux avis de ce chantier.'
      : 'Abonnement confirmé. Vous recevrez les prochains avis par courriel.',
  }
}
