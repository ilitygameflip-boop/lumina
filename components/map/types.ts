import type { Project } from '@/lib/types'

export type MapProject = Pick<Project, 'id' | 'slug' | 'name' | 'city' | 'status' | 'lat' | 'lng' | 'zone'>

export function toMapProject(p: Project): MapProject {
  return { id: p.id, slug: p.slug, name: p.name, city: p.city, status: p.status, lat: p.lat, lng: p.lng, zone: p.zone }
}
