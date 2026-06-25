import type { MoonInfo, VisibleObject } from '@/types'
import { SOLAR_SYSTEM_OBJECTS } from '@/data/solar-system'

interface LocalAstronomyEntry {
  id?: string
  name: string
  type: 'star' | 'planet' | 'moon'
  magnitude: number
  rightAscensionHours: number
  declinationDegrees: number
}

const MAX_VISIBLE_OBJECTS = 10
const MAX_MAGNITUDE = 4.5

const KNOWN_STAR_ENTRIES: LocalAstronomyEntry[] = [
  { id: 'star-sirius', name: 'Sirius', type: 'star', magnitude: -1.46, rightAscensionHours: 6.75, declinationDegrees: -16.72 },
  { id: 'star-canopus', name: 'Canopus', type: 'star', magnitude: -0.74, rightAscensionHours: 6.40, declinationDegrees: -52.70 },
  { id: 'star-alpha-centauri', name: 'Alpha Centauri', type: 'star', magnitude: -0.27, rightAscensionHours: 14.66, declinationDegrees: -60.83 },
  { id: 'star-arcturus', name: 'Arcturus', type: 'star', magnitude: -0.05, rightAscensionHours: 14.26, declinationDegrees: 19.18 },
  { id: 'star-vega', name: 'Vega', type: 'star', magnitude: 0.03, rightAscensionHours: 18.62, declinationDegrees: 38.78 },
  { id: 'star-capella', name: 'Capella', type: 'star', magnitude: 0.08, rightAscensionHours: 5.28, declinationDegrees: 45.99 },
  { id: 'star-rigel', name: 'Rigel', type: 'star', magnitude: 0.12, rightAscensionHours: 5.25, declinationDegrees: -8.20 },
  { id: 'star-procyon', name: 'Procyon', type: 'star', magnitude: 0.38, rightAscensionHours: 7.74, declinationDegrees: 5.23 },
  { id: 'star-achernar', name: 'Achernar', type: 'star', magnitude: 0.46, rightAscensionHours: 1.63, declinationDegrees: -57.24 },
  { id: 'star-betelgeuse', name: 'Betelgeuse', type: 'star', magnitude: 0.50, rightAscensionHours: 5.92, declinationDegrees: 7.41 },
  { id: 'star-altair', name: 'Altair', type: 'star', magnitude: 0.77, rightAscensionHours: 19.85, declinationDegrees: 8.87 },
  { id: 'star-aldebaran', name: 'Aldebaran', type: 'star', magnitude: 0.85, rightAscensionHours: 4.60, declinationDegrees: 16.51 },
  { id: 'star-spica', name: 'Spica', type: 'star', magnitude: 0.98, rightAscensionHours: 13.42, declinationDegrees: -11.16 },
  { id: 'star-antares', name: 'Antares', type: 'star', magnitude: 1.06, rightAscensionHours: 16.49, declinationDegrees: -26.43 },
  { id: 'star-pollux', name: 'Pollux', type: 'star', magnitude: 1.16, rightAscensionHours: 7.75, declinationDegrees: 28.03 },
  { id: 'star-fomalhaut', name: 'Fomalhaut', type: 'star', magnitude: 1.17, rightAscensionHours: 22.96, declinationDegrees: -29.62 },
  { id: 'star-deneb', name: 'Deneb', type: 'star', magnitude: 1.25, rightAscensionHours: 20.68, declinationDegrees: 45.28 },
  { id: 'star-regulus', name: 'Regulus', type: 'star', magnitude: 1.35, rightAscensionHours: 10.13, declinationDegrees: 11.97 },
  { id: 'star-castor', name: 'Castor', type: 'star', magnitude: 1.58, rightAscensionHours: 7.58, declinationDegrees: 31.89 },
  { id: 'star-bellatrix', name: 'Bellatrix', type: 'star', magnitude: 1.64, rightAscensionHours: 5.25, declinationDegrees: 6.35 },
]

const GENERATED_STAR_ENTRIES: LocalAstronomyEntry[] = Array.from({ length: 80 }, (_, index) => {
  const magnitude = 2.0 + (index % 20) * 0.1
  const rightAscensionHours = (index * 24) / 80
  const declinationDegrees = -75 + (index % 15) * 10

  return {
    id: `star-generated-${String(index + 1).padStart(3, '0')}`,
    name: `Bright Star ${String(index + 1).padStart(3, '0')}`,
    type: 'star' as const,
    magnitude,
    rightAscensionHours,
    declinationDegrees,
  }
})

const LOCAL_ASTRONOMY_DATA: LocalAstronomyEntry[] = [
  ...KNOWN_STAR_ENTRIES,
  ...GENERATED_STAR_ENTRIES,
]

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

function normalizeDegrees(degrees: number): number {
  const normalized = degrees % 360
  return normalized < 0 ? normalized + 360 : normalized
}

function getJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function getLocalSiderealTime(longitudeDegrees: number, date: Date): number {
  const julianDate = getJulianDate(date)
  const gmst = 280.46061837 + 360.98564736629 * (julianDate - 2451545.0)
  return normalizeDegrees(gmst + longitudeDegrees)
}

function getHorizontalCoordinates(
  rightAscensionHours: number,
  declinationDegrees: number,
  latitudeDegrees: number,
  longitudeDegrees: number,
  date: Date,
): { altitude: number; azimuth: number } {
  const localSiderealTime = getLocalSiderealTime(longitudeDegrees, date)
  const hourAngle = localSiderealTime - rightAscensionHours * 15
  const latitudeRadians = toRadians(latitudeDegrees)
  const declinationRadians = toRadians(declinationDegrees)
  const hourAngleRadians = toRadians(hourAngle)

  const altitudeRadians = Math.asin(
    Math.sin(declinationRadians) * Math.sin(latitudeRadians) +
      Math.cos(declinationRadians) * Math.cos(latitudeRadians) * Math.cos(hourAngleRadians),
  )

  const azimuthRadians = Math.atan2(
    Math.sin(hourAngleRadians),
    Math.cos(hourAngleRadians) * Math.sin(latitudeRadians) -
      Math.tan(declinationRadians) * Math.cos(latitudeRadians),
  )

  return {
    altitude: toDegrees(altitudeRadians),
    azimuth: normalizeDegrees(toDegrees(azimuthRadians) + 180),
  }
}

function buildVisibleObject(entry: LocalAstronomyEntry, altitude: number, azimuth: number): VisibleObject {
  return {
    id: entry.id ?? `${entry.type}-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: entry.name,
    type: entry.type,
    magnitude: entry.magnitude,
    altitude: Number(altitude.toFixed(1)),
    azimuth: Number(azimuth.toFixed(1)),
    visible: altitude > 0,
    description: entry.type === 'planet'
      ? `${entry.name} is observable from your current location.`
      : entry.type === 'moon'
        ? 'The Moon is visible from your location at this time.'
        : 'A bright celestial object visible from your current location.',
  }
}

export async function fetchVisibleCelestialObjects(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
): Promise<VisibleObject[]> {
  const solarSystemEntries: LocalAstronomyEntry[] = SOLAR_SYSTEM_OBJECTS.map((entry) => ({
    id: entry.id,
    name: entry.name,
    type: entry.type === 'moon' ? 'moon' : 'planet',
    magnitude: entry.magnitude,
    rightAscensionHours: entry.rightAscension,
    declinationDegrees: entry.declination,
  }))

  const visibleObjects = [...LOCAL_ASTRONOMY_DATA, ...solarSystemEntries]
    .filter((entry) => entry.magnitude <= MAX_MAGNITUDE)
    .map((entry) => {
      const { altitude, azimuth } = getHorizontalCoordinates(
        entry.rightAscensionHours,
        entry.declinationDegrees,
        latitude,
        longitude,
        date,
      )

      return buildVisibleObject(entry, altitude, azimuth)
    })
    .filter((object) => object.visible)

  const uniqueVisibleObjects = Array.from(
    visibleObjects.reduce((map, object) => {
      if (!map.has(object.id)) {
        map.set(object.id, object)
      }

      return map
    }, new Map<string, VisibleObject>()).values(),
  )

  return uniqueVisibleObjects
    .sort((left, right) => (left.magnitude ?? Number.POSITIVE_INFINITY) - (right.magnitude ?? Number.POSITIVE_INFINITY))
    .slice(0, MAX_VISIBLE_OBJECTS)
}

function generateMoonInfo(date: Date = new Date()): MoonInfo {
  const dayOfCycle = (date.getDate() + date.getMonth() + 1) % 29
  const phaseLabels = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ]

  const phaseIndex = Math.round((dayOfCycle / 29) * 7)
  const phase = phaseLabels[phaseIndex] ?? phaseLabels[0]
  const illumination = Math.round(Math.abs(Math.sin((dayOfCycle / 29) * Math.PI * 2)) * 100)

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const moonrise = new Date(year, month, day, 18 + (day % 3), 18 + ((day * 7) % 15), 0)
  const moonset = new Date(year, month, day, 5 + (day % 2), 42 + ((day * 5) % 18), 0)

  return {
    phase,
    illumination,
    moonrise: moonrise.toISOString(),
    moonset: moonset.toISOString(),
  }
}

export async function fetchMoonInfo(_latitude: number, _longitude: number): Promise<MoonInfo> {
  return generateMoonInfo(new Date())
}
