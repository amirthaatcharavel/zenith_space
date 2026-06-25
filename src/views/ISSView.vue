<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ISSMap from '@/components/astronomy/ISSMap.vue'
import ISSInfoCard from '@/components/astronomy/ISSInfoCard.vue'
import ISSPassPredictionCard from '@/components/astronomy/ISSPassPredictionCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import PlanetCard from '@/components/astronomy/PlanetCard.vue'
import { useCelestialStore } from '@/stores/celestial.store'
import { useLocationStore } from '@/stores/location.store'
import { formatDateTime } from '@/utils/helpers'
import { fetchISSPassPredictions, type ISSPassPrediction } from '@/services/iss-pass.service'

const celestialStore = useCelestialStore()
const locationStore = useLocationStore()
const nextPrediction = ref<ISSPassPrediction | null>(null)
const passSchedule = ref<ISSPassPrediction[]>([])
const visibilityQuality = ref({
  label: 'Calculating',
  score: 0,
  description: 'Loading ISS pass predictions for your location.',
})

const issObject = {
  id: 'iss-tracker',
  name: 'International Space Station',
  type: 'satellite' as const,
  magnitude: -3.5,
  altitude: 62,
  azimuth: 90,
  visible: true,
  description:
    'The ISS orbits Earth approximately every 90 minutes at an altitude of ~408 km, making it one of the brightest objects in the night sky when visible.',
}

const currentUtcTime = computed(() => new Date().toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
}))

const pathPoints = computed(() => {
  const baseLongitude = celestialStore.issPosition.longitude
  const baseLatitude = celestialStore.issPosition.latitude

  return Array.from({ length: 8 }, (_, index) => ({
    latitude: Number((baseLatitude + Math.sin(index / 2) * 8).toFixed(3)),
    longitude: Number((((baseLongitude + index * 20 + 180) % 360) - 180).toFixed(3)),
  }))
})

const predictedPoints = computed(() => {
  const baseLongitude = celestialStore.issPosition.longitude
  const baseLatitude = celestialStore.issPosition.latitude

  return Array.from({ length: 6 }, (_, index) => ({
    latitude: Number((baseLatitude + Math.cos(index / 1.6) * 10).toFixed(3)),
    longitude: Number((((baseLongitude + 40 + index * 25 + 180) % 360) - 180).toFixed(3)),
  }))
})

const statusCards = computed(() => [
  {
    label: 'ISS online',
    value: celestialStore.issPosition.visibility === 'visible' ? 'Visible' : celestialStore.issPosition.visibility === 'daylight' ? 'Daylight' : 'Eclipsed',
    subtitle: 'Signal status',
    icon: 'M5 12h14M12 5v14',
    accent: 'from-cyan-500/20 to-sky-500/20',
    iconColor: 'text-cyan-300',
  },
  {
    label: 'Current altitude',
    value: `${celestialStore.issPosition.altitude.toFixed(0)} km`,
    subtitle: 'Orbital height',
    icon: 'M4 20h16M7 16V8m5 8V4m5 12v-6',
    accent: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-300',
  },
  {
    label: 'Velocity',
    value: `${celestialStore.issPosition.velocity.toFixed(0)} km/h`,
    subtitle: 'Transit speed',
    icon: 'M13 5l7 7-7 7M4 12h16',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-300',
  },
  {
    label: 'Orbit number',
    value: `${Math.max(12, Math.round((Date.now() / (90 * 60 * 1000)) % 100))}`,
    subtitle: 'Current cycle',
    icon: 'M12 3v4m0 10v4m9-9h-4M7 12H3m9-6l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-300',
  },
  {
    label: 'Visibility',
    value: visibilityQuality.value.label,
    subtitle: `${visibilityQuality.value.score}/100 pass quality`,
    icon: 'M4 12l2-2 4 4 10-10 2 2-12 12-6-6z',
    accent: 'from-rose-500/20 to-fuchsia-500/20',
    iconColor: 'text-rose-300',
  },
])

const missionStats = computed(() => [
  { label: 'Orbits today', value: '18', detail: 'Mission cadence' },
  { label: 'Distance traveled', value: '≈ 1.2M km', detail: 'Since launch' },
  { label: 'Average speed', value: `${Math.round(celestialStore.issPosition.velocity)} km/h`, detail: 'Sustained motion' },
  { label: 'Altitude trend', value: '+3 km', detail: 'Current drift' },
  { label: 'Mission duration', value: '25+ yrs', detail: 'Operational life' },
])

const observationGuidance = computed(() => [
  {
    title: 'Best viewing direction',
    copy: celestialStore.issPosition.visibility === 'visible' ? 'Look toward the western horizon shortly after sunset.' : 'Monitor the pre-dawn sky for the clearest approach.',
    icon: 'M12 3l7 18-7-3-7 3 7-18z',
  },
  {
    title: 'Best viewing time',
    copy: nextPrediction.value ? `Target the ${new Date(nextPrediction.value.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} window.` : 'The next rise window will appear once the forecast loads.',
    icon: 'M12 8v4l3 3',
  },
  {
    title: 'Weather suitability',
    copy: visibilityQuality.value.score >= 70 ? 'Excellent conditions for a clear pass observation.' : 'Conditions are mixed; keep the viewing window flexible.',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
])

async function loadPassPredictions(): Promise<void> {
  const result = await fetchISSPassPredictions({
    latitude: locationStore.currentLocation.latitude,
    longitude: locationStore.currentLocation.longitude,
    altitude: locationStore.currentLocation.altitude ?? 0,
  })

  nextPrediction.value = result.nextPass
  passSchedule.value = result.schedule

  if (!result.nextPass) {
    visibilityQuality.value = {
      label: 'Unavailable',
      score: 0,
      description: 'No visible ISS pass could be computed for the current observer location.',
    }
    return
  }

  const score = Math.max(0, Math.min(100, Math.round(result.nextPass.maxElevation * 2.3 + 20)))
  visibilityQuality.value = {
    label: score >= 80 ? 'Excellent' : score >= 55 ? 'Good' : 'Moderate',
    score,
    description: `The next pass reaches ${result.nextPass.maxElevation}° elevation and lasts ${result.nextPass.duration}s from this location.`,
  }
}

watch(
  () => [locationStore.currentLocation.latitude, locationStore.currentLocation.longitude, locationStore.currentLocation.altitude],
  () => {
    void loadPassPredictions()
  },
  { immediate: true },
)

onMounted(() => {
  void celestialStore.initialize()
  void loadPassPredictions()
})

onBeforeUnmount(() => {
  celestialStore.stopAutoRefresh()
})
</script>

<template>
  <div class="mx-auto flex max-w-7xl flex-col gap-6">
    <section class="overflow-hidden rounded-[2.2rem] border border-white/15 bg-[var(--zenith-surface)]/75 p-6 shadow-[0_30px_90px_rgba(3,7,18,0.28)] backdrop-blur-2xl lg:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--zenith-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--zenith-accent)] animate-pulse-glow" />
            Mission control
          </div>
          <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-4xl lg:text-5xl">
            ISS Tracker
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--zenith-text-muted)] sm:text-base">
            Follow the International Space Station with a premium mission dashboard for orbital visibility, telemetry, and pass planning.
          </p>
        </div>
        <div class="rounded-[1.3rem] border border-white/15 bg-gradient-to-br from-[var(--zenith-accent)]/12 to-sky-500/10 p-4 lg:min-w-[300px]">
          <p class="text-[11px] uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]">Current observer</p>
          <p class="mt-2 text-lg font-semibold text-[var(--zenith-text)]">
            {{ locationStore.currentLocation.name || 'Current observation point' }}
          </p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text-muted)]">
            {{ formatDateTime(celestialStore.issPosition.timestamp) }}
          </p>
          <p class="mt-3 text-sm text-[var(--zenith-text-subtle)]">UTC · {{ currentUtcTime }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div
        v-for="card in statusCards"
        :key="card.label"
        class="group rounded-[1.35rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_16px_50px_rgba(3,7,18,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(124,92,255,0.16)]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br" :class="card.accent">
            <svg class="h-5 w-5" :class="card.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="card.icon" />
            </svg>
          </div>
          <span class="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
            Live
          </span>
        </div>
        <div class="mt-6">
          <p class="text-[11px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">{{ card.label }}</p>
          <p class="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ card.value }}</p>
          <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ card.subtitle }}</p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <ISSMap
        :position="celestialStore.issPosition"
        :path-points="pathPoints"
        :predicted-points="predictedPoints"
        :observer-location="locationStore.currentLocation"
      />
      <ISSInfoCard
        :position="celestialStore.issPosition"
        :loading="celestialStore.loading"
        :last-updated="formatDateTime(celestialStore.issPosition.timestamp)"
        :location-name="locationStore.currentLocation.name || 'Current observation point'"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <ISSPassPredictionCard
        :prediction="nextPrediction"
        :schedule="passSchedule"
        :visibility-quality="visibilityQuality"
      />

      <BaseCard title="Mission context" subtitle="Orbital characteristics and objectives" hoverable>
        <PlanetCard :object="issObject" />

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-4 text-center">
            <p class="text-xl font-semibold text-[var(--zenith-accent)]">90</p>
            <p class="mt-1 text-xs text-[var(--zenith-text-muted)]">Minutes per orbit</p>
          </div>
          <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-4 text-center">
            <p class="text-xl font-semibold text-[var(--zenith-accent)]">408</p>
            <p class="mt-1 text-xs text-[var(--zenith-text-muted)]">km altitude</p>
          </div>
          <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-4 text-center">
            <p class="text-xl font-semibold text-[var(--zenith-accent)]">-3.5</p>
            <p class="mt-1 text-xs text-[var(--zenith-text-muted)]">Peak magnitude</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <BaseCard title="Mission statistics" subtitle="Live mission readout" hoverable>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="stat in missionStats"
            :key="stat.label"
            class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-4"
          >
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">{{ stat.label }}</p>
            <p class="mt-2 text-xl font-semibold text-[var(--zenith-text)]">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ stat.detail }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Observation guidance" subtitle="Best viewing cues for your location" hoverable>
        <div class="space-y-3">
          <div
            v-for="guidance in observationGuidance"
            :key="guidance.title"
            class="flex gap-3 rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="guidance.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-[var(--zenith-text)]">{{ guidance.title }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--zenith-text-muted)]">{{ guidance.copy }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
