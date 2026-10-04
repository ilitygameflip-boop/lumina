import {
  Bike,
  Bus,
  Car,
  Droplets,
  Footprints,
  Home,
  type LucideIcon,
  ParkingCircle,
  Trash2,
  Volume2,
} from 'lucide-react'
import type { ImpactCategory } from '@/lib/types'

export const IMPACT_ICONS: Record<ImpactCategory, LucideIcon> = {
  circulation: Car,
  stationnement: ParkingCircle,
  pietons: Footprints,
  cyclistes: Bike,
  acces: Home,
  transport_collectif: Bus,
  bruit: Volume2,
  eau: Droplets,
  collectes: Trash2,
}

export function ImpactIcon({ category, className }: { category: ImpactCategory; className?: string }) {
  const Icon = IMPACT_ICONS[category]
  return <Icon className={className} aria-hidden="true" />
}
