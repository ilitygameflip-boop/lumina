import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { SITE } from '@/lib/config'

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo variant="light" />
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            {SITE.tagline}. Les informations sont publiées par les équipes de projet et mises à jour à chaque
            changement important.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Nous joindre</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <li>
              <a className="underline-offset-4 hover:underline" href={`tel:${SITE.supportPhone.replace(/\s/g, '')}`}>
                {SITE.supportPhone}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${SITE.supportEmail}`}>
                {SITE.supportEmail}
              </a>
            </li>
            <li>{SITE.supportHours}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Information</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <li><Link className="underline-offset-4 hover:underline" href="/chantiers">Tous les chantiers</Link></li>
            <li><Link className="underline-offset-4 hover:underline" href="/a-propos">À propos</Link></li>
            <li><Link className="underline-offset-4 hover:underline" href="/accessibilite">Accessibilité</Link></li>
            <li><Link className="underline-offset-4 hover:underline" href="/confidentialite">Confidentialité</Link></li>
            <li><Link className="underline-offset-4 hover:underline" href="/admin/connexion">Espace équipe</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 {SITE.organization}. Prototype de démonstration.</p>
          <p>Les chantiers, noms et coordonnées présentés sont fictifs.</p>
        </div>
      </div>
    </footer>
  )
}
