import type { CalendarEvent, MonthParams } from '@/types/calendar'
import { calendarCache } from './cache.service'
import {
  fetchApod,
  fetchNeoWs,
  fetchWeather,
  fetchLaunches
} from './apiClients'
import {
  mapApodToEvents,
  mapNeoWsToEvents,
  mapWeatherToEvents,
  mapLaunchesToEvents
} from './eventMapper'

export async function getCalendarEventsForMonth(params: MonthParams): Promise<CalendarEvent[]> {
  const cacheKey = `events-${params.year}-${params.month}-${params.latitude || 0}-${params.longitude || 0}`
  const cached = await calendarCache.getEvents(cacheKey)
  if (cached) {
    return cached
  }

  const results = await Promise.allSettled([
    fetchApod(params.year, params.month),
    fetchNeoWs(params.year, params.month),
    fetchLaunches(params.year, params.month),
    params.latitude && params.longitude ? fetchWeather(params.latitude, params.longitude) : Promise.resolve(null)
  ])

  let allEvents: CalendarEvent[] = []

  if (results[0].status === 'fulfilled' && results[0].value) {
    allEvents = allEvents.concat(mapApodToEvents(results[0].value))
  } else {
    console.error('Failed to fetch APOD', results[0])
  }
  
  if (results[1].status === 'fulfilled' && results[1].value) {
    allEvents = allEvents.concat(mapNeoWsToEvents(results[1].value))
  } else {
    console.error('Failed to fetch NeoWs', results[1])
  }

  if (results[2].status === 'fulfilled' && results[2].value) {
    allEvents = allEvents.concat(mapLaunchesToEvents(results[2].value))
  } else {
    console.error('Failed to fetch Launches', results[2])
  }

  if (results[3].status === 'fulfilled' && results[3].value) {
    allEvents = allEvents.concat(mapWeatherToEvents(results[3].value))
  } else if (results[3].status === 'rejected') {
    console.error('Failed to fetch Weather', results[3])
  }

  // Basic sorting
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  await calendarCache.setEvents(cacheKey, allEvents)
  return allEvents
}
