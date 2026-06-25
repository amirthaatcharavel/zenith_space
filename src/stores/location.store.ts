import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import type { Location } from '@/types'
import {
  DEFAULT_LOCATION,
  loadLocations as loadSavedLocations,
  saveLocation as saveSavedLocation,
  deleteLocation as deleteSavedLocation,
} from '@/services/location.service'

export const useLocationStore = defineStore('location', () => {
  const currentLocation = ref<Location>({ ...DEFAULT_LOCATION })
  const savedLocations = ref<Location[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const ACTIVE_LOCATION_KEY = 'zenith_active_location'

  const defaultLocation = computed(() =>
    savedLocations.value.find((loc) => loc.isDefault) ?? currentLocation.value,
  )

  const recentLocations = computed(() =>
    [...savedLocations.value]
      .sort((a, b) => {
        const dateA = a.savedAt ? new Date(a.savedAt).getTime() : 0
        const dateB = b.savedAt ? new Date(b.savedAt).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 5),
  )

  function setCurrentLocation(location: Location): void {
    currentLocation.value = { ...location }
    try {
      localStorage.setItem(ACTIVE_LOCATION_KEY, JSON.stringify(currentLocation.value))
    } catch {
      // ignore localStorage errors
    }
  }

  function updateCoordinates(latitude: number, longitude: number): void {
    currentLocation.value = {
      ...currentLocation.value,
      latitude,
      longitude,
    }
  }

  async function loadLocations(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      console.log('LOAD LOCATIONS CALLED')
      console.log('CURRENT USER:', authStore.user)
      console.log('CURRENT UID:', authStore.user?.id)
      if (!authStore.user) {
        savedLocations.value = []
        return
      }

      savedLocations.value = await loadSavedLocations(authStore.user.id)
      console.log('FIRESTORE RETURNED LOCATIONS:', savedLocations.value)
      console.log('LOCATION COUNT:', savedLocations.value.length)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load saved locations'
    } finally {
      loading.value = false
    }
  }

  const deviceLocationRequested = ref(false)
  let started = false

  // Detect device geolocation (returns true if successfully obtained)
  async function getReverseGeocodedName(latitude: number, longitude: number): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        format: 'jsonv2',
        addressdetails: '1',
      })
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'ZenithAstronomyApp/1.0',
        },
      })

      if (!response.ok) return null
      const data = await response.json()
      const address = data.address ?? {}
      const locality = address.suburb || address.village || address.town || address.city || null
      const region = address.state || address.county || null

      if (locality && region) {
        return `${locality}, ${region}`
      }
      if (locality) {
        return locality
      }
      if (region) {
        return region
      }
      return null
    } catch {
      return null
    }
  }

  async function detectDeviceLocation(): Promise<boolean> {
    if (deviceLocationRequested.value) return false
    deviceLocationRequested.value = true
    if (!navigator.geolocation) return false

    return new Promise<boolean>((resolve) => {
      let best: { latitude: number; longitude: number; accuracy: number } | null = null
      const options: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000,
      }

      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords

          if (typeof accuracy !== 'number') return
          if (!best || accuracy < best.accuracy) {
            best = { latitude, longitude, accuracy }
          }
        },
        () => {
          // ignore single error, continue until timeout
        },
        options,
      )

      const cleanup = async () => {
        navigator.geolocation.clearWatch(watchId)

        if (!best) {
          resolve(false)
          return
        }

        const { latitude, longitude } = best
        const name = await getReverseGeocodedName(latitude, longitude)
        currentLocation.value = {
          ...currentLocation.value,
          latitude,
          longitude,
          name: name ?? '',
        }
        try {
          localStorage.setItem(ACTIVE_LOCATION_KEY, JSON.stringify(currentLocation.value))
        } catch {
          // ignore localStorage errors
        }
        resolve(true)
      }

      setTimeout(cleanup, 15000)
    })
  }

  // Restore persisted active location from localStorage
  function restorePersistedLocation(): boolean {
    try {
      const raw = localStorage.getItem(ACTIVE_LOCATION_KEY)
      if (!raw) return false
      const parsed = JSON.parse(raw) as Location
      if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        currentLocation.value = parsed
        return true
      }
    } catch {
      // ignore restored location errors
    }
    return false
  }

  // Initialize store: attempt geolocation (primary), fallback to persisted or default, and load saved locations when authenticated
  async function initialize(): Promise<void> {
    if (started) return
    started = true

    const authStore = useAuthStore()
    console.log('LOCATION STORE INITIALIZE CALLED')
    console.log('AUTH USER DURING INIT:', authStore.user)

    try {
      const gotGeo = await detectDeviceLocation()
      if (!gotGeo) {
        const restored = restorePersistedLocation()
        if (!restored) {
          currentLocation.value = { ...DEFAULT_LOCATION }
        }
      }
    } catch {
      const restored = restorePersistedLocation()
      if (!restored) {
        currentLocation.value = { ...DEFAULT_LOCATION }
      }
    }

  }

  // Watch auth changes and auto-load saved locations on login / clear on logout
  const authStore = useAuthStore()
  watch(
    () => authStore.user?.id,
    async (uid) => {
      console.log('AUTH WATCH TRIGGERED:', uid)

      if (uid) {
        await loadLocations()

        console.log(
          'LOCATIONS AFTER AUTH RESTORE:',
          savedLocations.value,
        )
      } else {
        savedLocations.value = []
      }
    },
    {
      immediate: true,
    },
  )

  async function saveLocation(location: Omit<Location, 'id' | 'savedAt'>): Promise<Location | null> {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('User is not authenticated')
      }

      const savedLocation = await saveSavedLocation(authStore.user.id, location)
      savedLocations.value = [savedLocation, ...savedLocations.value]
      return savedLocation
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save location'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteLocation(id: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await deleteSavedLocation(id)
      savedLocations.value = savedLocations.value.filter((loc) => loc.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete location'
    } finally {
      loading.value = false
    }
  }

  async function removeLocation(id: string): Promise<void> {
    await deleteLocation(id)
  }

  function setDefaultLocation(id: string): void {
    savedLocations.value = savedLocations.value.map((loc) => ({
      ...loc,
      isDefault: loc.id === id,
    }))
    const selected = savedLocations.value.find((loc) => loc.id === id)
    if (selected) {
      setCurrentLocation(selected)
    }
  }

  return {
    currentLocation,
    savedLocations,
    loading,
    error,
    defaultLocation,
    recentLocations,
    setCurrentLocation,
    updateCoordinates,
    loadLocations,
    initialize,
    saveLocation,
    deleteLocation,
    removeLocation,
    setDefaultLocation,
  }
})
