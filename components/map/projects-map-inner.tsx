'use client'

import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import { STATUS_MAP_COLORS } from '@/components/project/badges'
import { STATUS_LABELS } from '@/lib/labels'
import type { MapProject } from './types'

function FitBounds({ projects, single }: { projects: MapProject[]; single: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (projects.length === 0) return
    if (single) {
      const pts = projects[0].zone.length ? projects[0].zone : [[projects[0].lat, projects[0].lng] as [number, number]]
      map.fitBounds(pts as LatLngBoundsExpression, { padding: [48, 48], maxZoom: 16 })
      return
    }
    const bounds = projects.map((p) => [p.lat, p.lng] as [number, number])
    if (bounds.length === 1) map.setView(bounds[0], 14)
    else map.fitBounds(bounds as LatLngBoundsExpression, { padding: [36, 36], maxZoom: 13 })
  }, [map, projects, single])
  return null
}

export default function ProjectsMapInner({
  projects,
  single = false,
  className,
}: {
  projects: MapProject[]
  single?: boolean
  className?: string
}) {
  return (
    <MapContainer
      center={[46.3, -72.8]}
      zoom={6}
      scrollWheelZoom={false}
      className={className}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds projects={projects} single={single} />
      {projects.map((p) => {
        const color = STATUS_MAP_COLORS[p.status]
        return (
          <div key={p.id}>
            {p.zone.length > 1 && (
              <Polyline
                positions={p.zone}
                pathOptions={{ color, weight: single ? 10 : 6, opacity: 0.75, lineCap: 'square' }}
              />
            )}
            {!single && (
              <CircleMarker
                center={[p.lat, p.lng]}
                radius={8}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 1 }}
              >
                <Popup>
                  <div className="flex min-w-48 flex-col gap-1 font-sans">
                    <span className="text-xs font-semibold" style={{ color }}>
                      {STATUS_LABELS[p.status]} · {p.city}
                    </span>
                    <span className="text-sm leading-snug font-semibold text-foreground">{p.name}</span>
                    <Link href={`/chantiers/${p.slug}`} className="mt-1 text-sm font-medium text-brand underline">
                      Voir le chantier
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </div>
        )
      })}
    </MapContainer>
  )
}
