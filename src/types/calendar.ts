export const EventCategory = {
  APOD: 'APOD',
  WEATHER: 'WEATHER',
  MOON_PHASE: 'MOON_PHASE',
  ISS_PASS: 'ISS_PASS',
  ECLIPSE: 'ECLIPSE',
  NEO: 'NEO',
  LAUNCH: 'LAUNCH',
  PLANET: 'PLANET',
  METEOR_SHOWER: 'METEOR_SHOWER',
} as const

export type EventCategory = typeof EventCategory[keyof typeof EventCategory]

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO string
  category: EventCategory
  description?: string
  source: string
  meta?: Record<string, any>
}

export interface MonthParams {
  year: number
  month: number // 1-12
  latitude?: number
  longitude?: number
}
