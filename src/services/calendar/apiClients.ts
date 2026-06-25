export async function fetchApod(year: number, month: number): Promise<any[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
  
  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`)
  if (!res.ok) throw new Error('Failed to fetch APOD')
  return res.json()
}

export async function fetchNeoWs(year: number, month: number): Promise<any> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  // NeoWs allows max 7 days per request. For a whole month, we should ideally fetch in chunks, 
  // but to prevent rate limiting, we'll fetch the first 7 days of the month for demonstration.
  const endDate = `${year}-${String(month).padStart(2, '0')}-07`
  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
  const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`)
  if (!res.ok) throw new Error('Failed to fetch NeoWs')
  return res.json()
}

export async function fetchWeather(lat: number, lon: number): Promise<any> {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`)
  if (!res.ok) throw new Error('Failed to fetch Weather')
  return res.json()
}

export async function fetchLaunches(year: number, month: number): Promise<any> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00Z`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}T23:59:59Z`
  const res = await fetch(`https://lldev.thespacedevs.com/2.2.0/launch/?net__gte=${startDate}&net__lte=${endDate}&limit=10`)
  if (!res.ok) throw new Error('Failed to fetch Launches')
  return res.json()
}

export async function fetchCelesTrakTLE(): Promise<string> {
  const res = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle')
  if (!res.ok) throw new Error('Failed to fetch CelesTrak TLE')
  return res.text()
}

export async function fetchAstronomyAPI(lat: number, lon: number, date: string): Promise<any> {
  const appId = import.meta.env.VITE_ASTRONOMY_API_ID || ''
  const secret = import.meta.env.VITE_ASTRONOMY_API_SECRET || ''
  const auth = btoa(`${appId}:${secret}`)
  
  if (!appId || !secret) {
    console.warn('AstronomyAPI credentials missing. Returning mock data.')
    return { data: { mocked: true } }
  }

  const res = await fetch(`https://api.astronomyapi.com/api/v2/bodies/positions?latitude=${lat}&longitude=${lon}&elevation=0&from_date=${date}&to_date=${date}&time=12:00:00`, {
    headers: { Authorization: `Basic ${auth}` }
  })
  if (!res.ok) throw new Error('Failed to fetch AstronomyAPI')
  return res.json()
}

export async function fetchWeatherApiMoonPhase(lat: number, lon: number, date: string): Promise<any> {
  const apiKey = import.meta.env.VITE_WEATHERAPI_KEY || ''
  if (!apiKey) {
    console.warn('WeatherAPI key missing. Returning mock data.')
    return { astronomy: { astro: { moon_phase: 'Mock Phase' } } }
  }
  const res = await fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${date}`)
  if (!res.ok) throw new Error('Failed to fetch WeatherAPI Moon Phase')
  return res.json()
}
