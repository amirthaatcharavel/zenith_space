import type { ISSPosition } from '@/types'

interface ISSApiResponse {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: string | number
}

export async function fetchISSPosition(): Promise<ISSPosition> {
  const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Unable to load ISS position (${response.status})`)
  }

  const data = (await response.json()) as ISSApiResponse

  const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Number(data.timestamp)

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    altitude: data.altitude,
    velocity: data.velocity,
    timestamp: new Date(timestamp * 1000).toISOString(),
    visibility: 'visible',
  }
}
