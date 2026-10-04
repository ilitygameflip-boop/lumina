import Link from 'next/link'
import { Info } from 'lucide-react'

export function DemoBanner() {
  return (
    <div className="bg-brand-deep text-white">
      <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        <span>
          Données de démonstration. Les chantiers présentés sont fictifs.{' '}
          <Link href="/a-propos" className="font-medium underline underline-offset-2">
            En savoir plus
          </Link>
        </span>
      </p>
    </div>
  )
}
