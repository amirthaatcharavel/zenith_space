export type CelestialObjectType =
  | 'planet'
  | 'star'
  | 'moon'
  | 'galaxy'
  | 'nebula'
  | 'comet'
  | 'satellite'

export interface CelestialObject {
  id: string
  name: string
  type: CelestialObjectType
  magnitude?: number
  altitude: number
  azimuth: number
  visible: boolean
  description?: string
}

export interface AstronomyCatalogEntry {
  id: string
  name: string
  type: CelestialObjectType
  magnitude: number
  rightAscension: number
  declination: number
  description: string
}

export interface MoonInfo {
  phase: string
  illumination: number
  moonrise: string | null
  moonset: string | null
}

export interface VisibleObject extends CelestialObject {
  riseTime?: string
  setTime?: string
  peakAltitude?: number
}
