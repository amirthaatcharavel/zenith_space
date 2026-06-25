import { twoline2satrec } from '../../node_modules/satellite.js/dist/io.js'
import { propagate, gstime } from '../../node_modules/satellite.js/dist/propagation.js'
import { eciToEcf, ecfToLookAngles } from '../../node_modules/satellite.js/dist/transforms.js'
import type { SatRec } from '../../node_modules/satellite.js/dist/propagation/SatRec.js'

export interface ISSPassPrediction {
  time: string
  duration: number
  maxElevation: number
}

export interface ISSPassPredictionResult {
  nextPass: ISSPassPrediction | null
  schedule: ISSPassPrediction[]
}

interface ISSObserver {
  latitude: number
  longitude: number
  altitude: number
}

const ISS_TLE = {
  line1: '1 25544U 98067A   26250.79585470  .00006838  00000-0  12618-3 0  9998',
  line2: '2 25544  51.6396  22.8629 0002990  92.2161 267.9214 15.50338464410330',
}

const FALLBACK_TLE_URL = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'
const TLE_FETCH_TIMEOUT_MS = 5000
let hasWarnedAboutTleFallback = false

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date)
  normalized.setSeconds(0, 0)
  return normalized
}

async function getIssTle(): Promise<{ line1: string; line2: string }> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), TLE_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(FALLBACK_TLE_URL, {
      headers: { Accept: 'text/plain' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Unable to fetch TLE (${response.status})`)
    }

    const text = await response.text()
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length >= 2) {
      return { line1: lines[0], line2: lines[1] }
    }
  } catch (error) {
    const isDevelopment = import.meta.env.DEV
    const isAbortError = error instanceof DOMException && error.name === 'AbortError'

    if (isDevelopment && !hasWarnedAboutTleFallback && !isAbortError) {
      hasWarnedAboutTleFallback = true
      console.warn('ISS TLE fetch failed; using embedded fallback TLE.')
    }

    if (isDevelopment && !hasWarnedAboutTleFallback && isAbortError) {
      hasWarnedAboutTleFallback = true
      console.warn('ISS TLE fetch timed out, using embedded fallback TLE.')
    }
  } finally {
    window.clearTimeout(timeoutId)
  }

  return ISS_TLE
}

function computeLookAngles(observer: ISSObserver, date: Date, satrec: SatRec): number {
  const positionAndVelocity = propagate(satrec, date)

  if (!positionAndVelocity?.position) {
    return -Infinity
  }

  const gmst = gstime(date)
  const positionEcf = eciToEcf(positionAndVelocity.position, gmst)

  const observerGeodetic = {
    longitude: observer.longitude * (Math.PI / 180),
    latitude: observer.latitude * (Math.PI / 180),
    height: observer.altitude / 1000,
  }

  const lookAngles = ecfToLookAngles(
    observerGeodetic,
    positionEcf,
  )

  return toDegrees(lookAngles.elevation)
}

export async function fetchISSPassPredictions(
  observer: ISSObserver,
  baseDate: Date = new Date(),
): Promise<ISSPassPredictionResult> {
  const tle = await getIssTle()
  const satrec = twoline2satrec(tle.line1, tle.line2)
  const startTime = normalizeDate(baseDate).getTime()
  const endTime = startTime + 7 * 24 * 60 * 60 * 1000
  const stepMs = 30 * 1000

  const passes: ISSPassPrediction[] = []
  let activePassStart: number | null = null
  let maxElevation = -Infinity

  for (let timestamp = startTime; timestamp <= endTime; timestamp += stepMs) {
    const date = new Date(timestamp)
    const elevation = computeLookAngles(observer, date, satrec)

    if (elevation > 0) {
      if (activePassStart === null) {
        activePassStart = timestamp
      }
      maxElevation = Math.max(maxElevation, elevation)
      continue
    }

    if (activePassStart !== null) {
      const durationSeconds = Math.round((timestamp - activePassStart) / 1000)
      if (durationSeconds >= 60 && maxElevation > 0) {
        passes.push({
          time: new Date(activePassStart).toISOString(),
          duration: durationSeconds,
          maxElevation: Math.round(maxElevation),
        })
      }

      activePassStart = null
      maxElevation = -Infinity
    }
  }

  if (activePassStart !== null) {
    const durationSeconds = Math.round((endTime - activePassStart) / 1000)
    if (durationSeconds >= 60 && maxElevation > 0) {
      passes.push({
        time: new Date(activePassStart).toISOString(),
        duration: durationSeconds,
        maxElevation: Math.round(maxElevation),
      })
    }
  }

  const futurePasses = passes
    .filter((pass) => new Date(pass.time).getTime() >= startTime)
    .sort((left, right) => new Date(left.time).getTime() - new Date(right.time).getTime())

  return {
    nextPass: futurePasses[0] ?? null,
    schedule: futurePasses.slice(0, 7),
  }
}
