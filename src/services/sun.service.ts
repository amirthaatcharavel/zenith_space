import { getTimes } from 'suncalc'
import type { SolarInfo } from '@/types'

function toIsoString(value: Date | null | undefined): string {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value.toISOString() : ''
}

export async function fetchSolarInfo(latitude: number, longitude: number): Promise<SolarInfo> {
  const date = new Date()
  const times = getTimes(date, latitude, longitude)

  const sunrise = toIsoString(times.sunrise)
  const sunset = toIsoString(times.sunset)
  const civilTwilight = `${toIsoString(times.dawn)} — ${toIsoString(times.dusk)}`
  const astronomicalTwilight = `${toIsoString(times.nightEnd)} — ${toIsoString(times.night)}`

  if (!sunrise || !sunset || !civilTwilight.includes(' — ') || !astronomicalTwilight.includes(' — ')) {
    throw new Error('Solar information is unavailable for the selected location')
  }

  return {
    sunrise,
    sunset,
    civilTwilight,
    astronomicalTwilight,
  }
}
