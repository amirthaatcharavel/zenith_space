import { type CalendarEvent, EventCategory } from '@/types/calendar'

export function mapApodToEvents(apodData: any[]): CalendarEvent[] {
  if (!Array.isArray(apodData)) return []
  return apodData.map((item) => ({
    id: `apod-${item.date}`,
    title: 'APOD: ' + item.title,
    date: item.date,
    category: EventCategory.APOD,
    description: item.explanation,
    source: 'NASA',
    meta: { url: item.url, media_type: item.media_type }
  }))
}

export function mapNeoWsToEvents(neoWsData: any): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const nearEarthObjects = neoWsData?.near_earth_objects || {}
  
  for (const date in nearEarthObjects) {
    nearEarthObjects[date].forEach((neo: any) => {
      events.push({
        id: `neo-${neo.id}-${date}`,
        title: `NEO: ${neo.name}`,
        date,
        category: EventCategory.NEO,
        source: 'NASA NeoWs',
        description: `Potentially Hazardous: ${neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}`,
        meta: {
          magnitude: neo.absolute_magnitude_h,
          diameterMax: neo.estimated_diameter?.kilometers?.estimated_diameter_max
        }
      })
    })
  }
  return events
}

export function mapWeatherToEvents(weatherData: any): CalendarEvent[] {
  if (!weatherData?.daily) return []
  const events: CalendarEvent[] = []
  const daily = weatherData.daily
  
  for (let i = 0; i < daily.time.length; i++) {
    events.push({
      id: `weather-${daily.time[i]}`,
      title: `Weather: ${daily.temperature_2m_max[i]}°C`,
      date: daily.time[i],
      category: EventCategory.WEATHER,
      source: 'Open-Meteo',
      meta: {
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        sunrise: daily.sunrise[i],
        sunset: daily.sunset[i],
        weatherCode: daily.weathercode[i]
      }
    })
  }
  return events
}

export function mapLaunchesToEvents(launchData: any): CalendarEvent[] {
  if (!launchData?.results) return []
  return launchData.results.map((launch: any) => ({
    id: `launch-${launch.id}`,
    title: `Launch: ${launch.name}`,
    date: launch.net.split('T')[0],
    category: EventCategory.LAUNCH,
    source: 'SpaceDevs',
    description: launch.mission?.description,
    meta: {
      provider: launch.launch_service_provider?.name,
      location: launch.pad?.location?.name
    }
  }))
}
