import type { WeatherCondition } from '@/types'

interface OpenMeteoWeatherResponse {
  current: {
    time: string
    temperature_2m: number
    cloud_cover: number
    visibility: number
    relative_humidity_2m: number
    wind_speed_10m: number
  }
}

export async function fetchWeatherConditions(latitude: number, longitude: number): Promise<WeatherCondition> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,cloud_cover,visibility,relative_humidity_2m,wind_speed_10m',
    timezone: 'auto',
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Unable to load weather data (${response.status})`)
  }

  const data = (await response.json()) as OpenMeteoWeatherResponse
  const current = data.current

  return {
    temperature: current.temperature_2m,
    cloudCover: current.cloud_cover,
    visibility: Number((current.visibility / 1000).toFixed(1)),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    timestamp: current.time,
  }
}
