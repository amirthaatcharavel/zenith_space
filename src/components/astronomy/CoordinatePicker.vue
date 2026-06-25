<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { formatCoordinate } from '@/utils/helpers'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface Props {
  latitude: number
  longitude: number
  name?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [latitude: number, longitude: number]
  save: [name: string, latitude: number, longitude: number]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

const latInput = ref(String(props.latitude))
const lngInput = ref(String(props.longitude))
const locationName = ref(props.name ?? '')

watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    latInput.value = String(lat)
    lngInput.value = String(lng)
    if (map && marker) {
      const latNum = Number(lat)
      const lngNum = Number(lng)
      marker.setLatLng([latNum, lngNum])
      map.setView([latNum, lngNum])
    }
  },
)

function applyCoordinates(): void {
  const lat = parseFloat(latInput.value)
  const lng = parseFloat(lngInput.value)

  if (Number.isNaN(lat) || Number.isNaN(lng)) return
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return

  emit('update', lat, lng)
  if (map && marker) {
    marker.setLatLng([lat, lng])
    map.setView([lat, lng])
  }
}

function handleSave(): void {
  const lat = parseFloat(latInput.value)
  const lng = parseFloat(lngInput.value)
  const name = locationName.value.trim()

  if (Number.isNaN(lat) || Number.isNaN(lng) || !name) return

  emit('save', name, lat, lng)
}

function onMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng
  latInput.value = String(lat)
  lngInput.value = String(lng)
  emit('update', lat, lng)
  if (marker) marker.setLatLng([lat, lng])
}

async function useDeviceLocation(): Promise<void> {
  if (!navigator.geolocation) return
  return new Promise<void>((resolve) => {
    let best: { latitude: number; longitude: number; accuracy: number } | null = null
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000,
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords

        if (typeof accuracy !== 'number') return
        if (!best || accuracy < best.accuracy) {
          best = { latitude, longitude, accuracy }
          latInput.value = String(latitude)
          lngInput.value = String(longitude)
          emit('update', latitude, longitude)
          if (marker) marker.setLatLng([latitude, longitude])
          if (map) map.setView([latitude, longitude], 13)
        }
      },
      () => {
        // ignore errors while waiting for better location
      },
      options,
    )

    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId)
      if (best) {
        const { latitude, longitude } = best
        latInput.value = String(latitude)
        lngInput.value = String(longitude)
        emit('update', latitude, longitude)
        if (marker) marker.setLatLng([latitude, longitude])
        if (map) map.setView([latitude, longitude], 13)
      }
      resolve()
    }, 15000)
  })
}

onMounted(async () => {
  await nextTick()
  if (!mapEl.value) return

  map = L.map(mapEl.value, { center: [Number(props.latitude), Number(props.longitude)], zoom: 5 })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  marker = L.marker([Number(props.latitude), Number(props.longitude)], { draggable: false }).addTo(map)
  map.on('click', onMapClick)
})

onBeforeUnmount(() => {
  if (map) {
    map.off('click', onMapClick)
    map.remove()
    map = null
    marker = null
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BaseInput
        v-model="latInput"
        label="Latitude"
        type="number"
        placeholder="-90 to 90"
        hint="Decimal degrees"
      />
      <BaseInput
        v-model="lngInput"
        label="Longitude"
        type="number"
        placeholder="-180 to 180"
        hint="Decimal degrees"
      />
    </div>

    <div class="rounded-lg border border-[var(--zenith-border-subtle)] bg-[var(--zenith-surface-elevated)] px-4 py-3">
      <p class="text-xs font-medium uppercase tracking-wider text-[var(--zenith-text-subtle)]">Current Selection</p>
      <p class="mt-1 font-mono text-sm text-[var(--zenith-accent)]">
        {{ formatCoordinate(parseFloat(latInput) || 0, 'lat') }},
        {{ formatCoordinate(parseFloat(lngInput) || 0, 'lng') }}
      </p>
    </div>

    <div ref="mapEl" style="height: 320px;" class="rounded-lg overflow-hidden" />

    <BaseInput
      v-model="locationName"
      label="Location Name"
      placeholder="e.g. Mauna Kea Observatory"
    />

    <div class="flex flex-wrap gap-3">
      <BaseButton variant="primary" @click="applyCoordinates">
        Apply Coordinates
      </BaseButton>
      <BaseButton variant="secondary" @click="handleSave">
        Save Location
      </BaseButton>
      <BaseButton variant="ghost" @click="useDeviceLocation">
        Use Current Location
      </BaseButton>
    </div>
  </div>
</template>
