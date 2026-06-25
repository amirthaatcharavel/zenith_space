<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { ISSPosition } from '@/types'

interface Props {
  position: ISSPosition
  pathPoints: Array<{ latitude: number; longitude: number }>
  predictedPoints: Array<{ latitude: number; longitude: number }>
  observerLocation?: { latitude: number; longitude: number; name?: string } | null
}

const props = withDefaults(defineProps<Props>(), {
  observerLocation: null,
})

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
let observerLayer: L.LayerGroup | null = null
let currentPathLayer: L.Polyline | null = null
let predictedPathLayer: L.Polyline | null = null

function buildMap(): void {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView([0, 0], 2)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    subdomains: ['a', 'b', 'c'],
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  observerLayer = L.layerGroup().addTo(map)
  currentPathLayer = L.polyline([], { color: '#7C5CFC', weight: 2.4, opacity: 0.9 }).addTo(map)
  predictedPathLayer = L.polyline([], { color: '#FBBF24', weight: 2, opacity: 0.7, dashArray: '6 4' }).addTo(map)

  updateLayers()
}

function updateLayers(): void {
  if (!map || !markerLayer || !observerLayer || !currentPathLayer || !predictedPathLayer) return

  markerLayer.clearLayers()
  observerLayer.clearLayers()

  const issIcon = L.divIcon({
    html: '<div style="width: 16px; height: 16px; border-radius: 9999px; background: linear-gradient(135deg, #7c5cff, #38bdf8); border: 2px solid rgba(255,255,255,0.95); box-shadow: 0 0 16px rgba(124, 92, 252, 0.55);"></div>',
    className: '',
    iconSize: [16, 16],
  })

  const observerIcon = L.divIcon({
    html: '<div style="width: 14px; height: 14px; border-radius: 9999px; background: #34d399; border: 2px solid rgba(255,255,255,0.95); box-shadow: 0 0 12px rgba(52, 211, 153, 0.45);"></div>',
    className: '',
    iconSize: [14, 14],
  })

  const position = L.latLng(props.position.latitude, props.position.longitude)
  L.marker(position, { icon: issIcon }).addTo(markerLayer)

  if (props.observerLocation) {
    const observerPosition = L.latLng(props.observerLocation.latitude, props.observerLocation.longitude)
    L.marker(observerPosition, { icon: observerIcon }).addTo(observerLayer)
    L.circle(observerPosition, { radius: 1200000, color: '#34d399', weight: 1, fillColor: '#34d399', fillOpacity: 0.12 }).addTo(observerLayer)
  }

  currentPathLayer.setLatLngs(props.pathPoints.map((point) => [point.latitude, point.longitude]))
  predictedPathLayer.setLatLngs(props.predictedPoints.map((point) => [point.latitude, point.longitude]))

  if (props.pathPoints.length > 0) {
    const bounds = L.latLngBounds(
      props.pathPoints.map((point) => [point.latitude, point.longitude] as [number, number]),
    )

    if (props.observerLocation) {
      bounds.extend([props.observerLocation.latitude, props.observerLocation.longitude])
    }

    map.fitBounds(bounds, { padding: [24, 24] })
  }
}

watch(() => [props.position.latitude, props.position.longitude, props.pathPoints, props.predictedPoints, props.observerLocation?.latitude, props.observerLocation?.longitude], () => {
  updateLayers()
})

onMounted(() => {
  buildMap()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="overflow-hidden rounded-[1.4rem] border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.2),_transparent_55%),linear-gradient(145deg,rgba(15,20,38,0.96),rgba(6,8,20,0.96))] p-3 shadow-[0_30px_70px_rgba(3,7,18,0.28)]">
    <div class="mb-3 flex items-center justify-between gap-3 rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">
      <div>
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Orbital track</p>
        <p class="text-sm font-medium text-[var(--zenith-text)]">Live ISS path and observer window</p>
      </div>
      <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
        Mission map
      </span>
    </div>
    <div ref="mapContainer" class="h-[430px] w-full rounded-[1rem]" />
  </div>
</template>
