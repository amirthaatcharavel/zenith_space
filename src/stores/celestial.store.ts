import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ISSPosition, VisibleObject, WeatherCondition, SolarInfo } from '@/types'
import { useLocationStore } from '@/stores/location.store'
import { fetchISSPosition } from '@/services/iss.service'
import { fetchWeatherConditions } from '@/services/weather.service'
import { fetchSolarInfo } from '@/services/sun.service'
import { fetchMoonInfo, fetchVisibleCelestialObjects } from '@/services/astronomy.service'

export type ObjectFilter = 'all' | 'planet' | 'star' | 'moon' | 'galaxy' | 'nebula' | 'satellite'

const EMPTY_ISS_POSITION: ISSPosition = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
  velocity: 0,
  timestamp: new Date().toISOString(),
  visibility: 'visible',
}

export const useCelestialStore = defineStore('celestial', () => {
  const visibleObjects = ref<VisibleObject[]>([])
  const issPosition = ref<ISSPosition>({ ...EMPTY_ISS_POSITION })
  const selectedObjectId = ref<string | null>(null)
  const activeFilter = ref<ObjectFilter>('all')
  const loading = ref(false)
  const visibleObjectsLoading = ref(false)
  const visibleObjectsError = ref<string | null>(null)
  const issError = ref<string | null>(null)
  const weather = ref<WeatherCondition | null>(null)
  const weatherLoading = ref(false)
  const weatherError = ref<string | null>(null)
  const solarInfo = ref<SolarInfo | null>(null)
  const solarLoading = ref(false)
  const solarError = ref<string | null>(null)
  const moonInfo = ref<import('@/types').MoonInfo | null>(null)
  const moonLoading = ref(false)
  const moonError = ref<string | null>(null)
  const initialized = ref(false)
  let issRefreshTimer: ReturnType<typeof window.setInterval> | null = null
  let weatherRefreshTimer: ReturnType<typeof window.setInterval> | null = null
  let solarRefreshTimer: ReturnType<typeof window.setTimeout> | null = null
  let visibleObjectsRefreshTimer: ReturnType<typeof window.setInterval> | null = null

  const locationStore = useLocationStore()

  watch(
    () => [locationStore.currentLocation.latitude, locationStore.currentLocation.longitude],
    () => {
      void refreshVisibleObjects()
      void refreshMoonInfo()
      void refreshWeatherConditions()
      void refreshSolarInfo()
    },
  )

  const radarObjects = computed<VisibleObject[]>(() => {
    const objects = visibleObjects.value
      .filter((obj) => obj.visible)
      .map((obj) => ({ ...obj }))

    const issAltitude = Math.min(85, Math.max(15, issPosition.value.altitude / 1000))
    const issObject: VisibleObject = {
      id: 'iss',
      name: 'ISS',
      type: 'satellite',
      magnitude: 0,
      altitude: issPosition.value.visibility === 'visible' ? issAltitude : 0,
      azimuth: 180,
      visible: issPosition.value.visibility === 'visible',
      description: 'The International Space Station is currently passing overhead.',
    }

    return [...objects, issObject]
  })

  const filteredRadarObjects = computed(() => {
    if (activeFilter.value === 'all') {
      return radarObjects.value
    }
    return radarObjects.value.filter((obj) => obj.type === activeFilter.value)
  })

  const selectedObject = computed(() =>
    radarObjects.value.find((obj) => obj.id === selectedObjectId.value) ?? null,
  )

  const currentlyVisible = computed(() =>
    visibleObjects.value.filter((obj) => obj.visible),
  )

  const issIsVisible = computed(() => issPosition.value.visibility === 'visible')

  function setSelectedObject(id: string | null): void {
    selectedObjectId.value = id
  }

  function setActiveFilter(filter: ObjectFilter): void {
    activeFilter.value = filter
  }

  async function refreshVisibleObjects(): Promise<void> {
    visibleObjectsLoading.value = true
    visibleObjectsError.value = null

    try {
      const objects = await fetchVisibleCelestialObjects(
        locationStore.currentLocation.latitude,
        locationStore.currentLocation.longitude,
        new Date(),
      )
      visibleObjects.value = objects
    } catch (error) {
      visibleObjectsError.value = error instanceof Error ? error.message : 'Unable to load visible objects'
      visibleObjects.value = []
    } finally {
      visibleObjectsLoading.value = false
    }
  }

  async function refreshISSPosition(): Promise<void> {
    loading.value = true
    issError.value = null

    try {
      issPosition.value = await fetchISSPosition()
    } catch (error) {
      issError.value = error instanceof Error ? error.message : 'Unable to load ISS position'
    } finally {
      loading.value = false
    }
  }

  async function refreshWeatherConditions(): Promise<void> {
    weatherLoading.value = true
    weatherError.value = null

    try {
      weather.value = await fetchWeatherConditions(
        locationStore.currentLocation.latitude,
        locationStore.currentLocation.longitude,
      )
    } catch (error) {
      weatherError.value = error instanceof Error ? error.message : 'Unable to load weather data'
    } finally {
      weatherLoading.value = false
    }
  }

  async function refreshSolarInfo(): Promise<void> {
    solarLoading.value = true
    solarError.value = null

    try {
      solarInfo.value = await fetchSolarInfo(
        locationStore.currentLocation.latitude,
        locationStore.currentLocation.longitude,
      )
    } catch (error) {
      solarError.value = error instanceof Error ? error.message : 'Unable to load solar information'
    } finally {
      solarLoading.value = false
    }
  }

  async function refreshMoonInfo(): Promise<void> {
    moonLoading.value = true
    moonError.value = null

    try {
      moonInfo.value = await fetchMoonInfo(
        locationStore.currentLocation.latitude,
        locationStore.currentLocation.longitude,
      )
    } catch (error) {
      moonError.value = error instanceof Error ? error.message : 'Unable to load moon information'
    } finally {
      moonLoading.value = false
    }
  }

  async function initialize(): Promise<void> {
    if (initialized.value) return
    initialized.value = true

    startAutoRefresh()
    await Promise.allSettled([
      refreshVisibleObjects(),
      refreshMoonInfo(),
      refreshISSPosition(),
      refreshWeatherConditions(),
      refreshSolarInfo(),
    ])
  }

  function startAutoRefresh(): void {
    if (issRefreshTimer || weatherRefreshTimer || solarRefreshTimer || visibleObjectsRefreshTimer) return

    issRefreshTimer = window.setInterval(() => {
      void refreshISSPosition()
    }, 15000)

    weatherRefreshTimer = window.setInterval(() => {
      void refreshWeatherConditions()
    }, 600000)

    solarRefreshTimer = window.setTimeout(() => {
      void refreshSolarInfo()
    }, 86400000)

    visibleObjectsRefreshTimer = window.setInterval(() => {
      void refreshVisibleObjects()
    }, 60000)
  }

  function stopAutoRefresh(): void {
    if (issRefreshTimer) {
      window.clearInterval(issRefreshTimer)
      issRefreshTimer = null
    }

    if (weatherRefreshTimer) {
      window.clearInterval(weatherRefreshTimer)
      weatherRefreshTimer = null
    }

    if (solarRefreshTimer) {
      window.clearTimeout(solarRefreshTimer)
      solarRefreshTimer = null
    }

    if (visibleObjectsRefreshTimer) {
      window.clearInterval(visibleObjectsRefreshTimer)
      visibleObjectsRefreshTimer = null
    }
  }

  return {
    visibleObjects,
    radarObjects,
    issPosition,
    selectedObjectId,
    activeFilter,
    loading,
    visibleObjectsLoading,
    visibleObjectsError,
    issError,
    weather,
    weatherLoading,
    weatherError,
    solarInfo,
    solarLoading,
    solarError,
    moonInfo,
    moonLoading,
    moonError,
    filteredRadarObjects,
    selectedObject,
    currentlyVisible,
    issIsVisible,
    setSelectedObject,
    setActiveFilter,
    refreshVisibleObjects,
    refreshISSPosition,
    refreshWeatherConditions,
    refreshSolarInfo,
    refreshMoonInfo,
    initialize,
    startAutoRefresh,
    stopAutoRefresh,
  }
})
