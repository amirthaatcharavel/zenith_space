<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import PlanetCard from '@/components/astronomy/PlanetCard.vue'
import ISSPanel from '@/components/astronomy/ISSPanel.vue'
import { useLocationStore } from '@/stores/location.store'
import { useCelestialStore } from '@/stores/celestial.store'
import { formatCoordinate, formatTime } from '@/utils/helpers'

const locationStore = useLocationStore()
const celestialStore = useCelestialStore()

onMounted(() => {
  void celestialStore.initialize()
})

onBeforeUnmount(() => {
  celestialStore.stopAutoRefresh()
})

function formatTwilightRange(value: string): string {
  const [start, end] = value.split(' — ')

  if (!start || !end) {
    return value
  }

  return `${formatTime(start)} – ${formatTime(end)}`
}

const summaryCards = computed(() => {
  const weather = celestialStore.weather
  const cloudCover = weather?.cloudCover ?? 0
  const visibility = weather?.visibility ?? 0
  const score = Math.max(40, Math.min(98, Math.round(68 + visibility / 6 - cloudCover / 8 + celestialStore.currentlyVisible.length * 2)))

  return [
    {
      label: 'Current Location',
      value: locationStore.currentLocation.name || 'Current Device Location',
      subtitle: `${formatCoordinate(locationStore.currentLocation.latitude, 'lat')} • ${formatCoordinate(locationStore.currentLocation.longitude, 'lng')}`,
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
      accent: 'from-violet-500/20 to-indigo-500/20',
      iconColor: 'text-violet-300',
    },
    {
      label: 'Visible Objects',
      value: celestialStore.currentlyVisible.length.toString(),
      subtitle: 'Above the horizon',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      accent: 'from-sky-500/20 to-cyan-500/20',
      iconColor: 'text-sky-300',
    },
    {
      label: 'Cloud Cover',
      value: weather ? `${weather.cloudCover}%` : '—',
      subtitle: 'Observation clarity',
      icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
      accent: 'from-cyan-500/20 to-blue-500/20',
      iconColor: 'text-cyan-300',
    },
    {
      label: 'Moon Illumination',
      value: celestialStore.moonInfo ? `${celestialStore.moonInfo.illumination}%` : '—',
      subtitle: 'Current lunar phase',
      icon: 'M20 14a8 8 0 11-8-8 8 8 0 008 8z',
      accent: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-300',
    },
    {
      label: 'ISS Status',
      value: celestialStore.issPosition.visibility === 'visible' ? 'Visible' : 'Tracking',
      subtitle: 'Live orbital state',
      icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
      accent: 'from-fuchsia-500/20 to-purple-500/20',
      iconColor: 'text-fuchsia-300',
    },
    {
      label: 'Observation Score',
      value: `${score}%`,
      subtitle: 'Readiness for tonight',
      icon: 'M4 8h16M7 4v16m10-16v16',
      accent: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-300',
    },
  ]
})

const observationScore = computed(() => {
  const weather = celestialStore.weather
  const visibility = weather?.visibility ?? 0
  const cloudCover = weather?.cloudCover ?? 0
  return Math.max(40, Math.min(98, Math.round(68 + visibility / 6 - cloudCover / 8 + celestialStore.currentlyVisible.length * 2)))
})

const observationLabel = computed(() => {
  const score = observationScore.value
  if (score >= 85) return 'Exceptional'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Moderate'
  return 'Limited'
})

const weatherStatus = computed(() => {
  const weather = celestialStore.weather
  if (!weather) {
    return { label: 'Stand by', classes: 'text-[var(--zenith-text-muted)] bg-white/8' }
  }

  if (weather.visibility >= 12 && weather.cloudCover <= 20) {
    return { label: 'Excellent', classes: 'text-[var(--zenith-success)] bg-[var(--zenith-success)]/10' }
  }

  if (weather.visibility >= 8 && weather.cloudCover <= 40) {
    return { label: 'Good', classes: 'text-[var(--zenith-warning)] bg-[var(--zenith-warning)]/10' }
  }

  return { label: 'Watch', classes: 'text-[var(--zenith-text-muted)] bg-white/8' }
})

const quickActions = [
  {
    title: 'Open Sky Radar',
    description: 'Live object tracking',
    to: '/radar',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: 'ISS Tracker',
    description: 'Orbital telemetry',
    to: '/iss',
    icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
  },
  {
    title: 'Saved Locations',
    description: 'Observation sites',
    to: '/locations',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  },
  {
    title: 'Refresh Data',
    description: 'Sync latest feed',
    to: '/dashboard',
    icon: 'M4 4v5h.5M20 20v-5h-.5M4 9a8 8 0 0112.9-3.7L20 5m0 0v5h-5m5 0a8 8 0 01-12.9 3.7L4 19',
  },
]

const recentActivity = computed(() => [
  {
    title: 'Location Updated',
    detail: locationStore.currentLocation.name || 'Current device location',
    time: 'Live',
  },
  {
    title: 'ISS Position Updated',
    detail: `${formatCoordinate(celestialStore.issPosition.latitude, 'lat')} • ${formatCoordinate(celestialStore.issPosition.longitude, 'lng')}`,
    time: 'Live',
  },
  {
    title: 'Moon Data Refreshed',
    detail: celestialStore.moonInfo?.phase ?? 'Latest phase available',
    time: 'Live',
  },
  {
    title: 'Weather Refreshed',
    detail: celestialStore.weather ? `${celestialStore.weather.visibility} km visibility` : 'Awaiting latest feed',
    time: 'Live',
  },
])
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
    <section class="overflow-hidden rounded-[2.2rem] border border-white/20 bg-[var(--zenith-surface)]/70 p-6 shadow-[0_30px_90px_rgba(3,7,18,0.28)] backdrop-blur-2xl lg:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--zenith-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--zenith-accent)] animate-pulse-glow" />
            Mission Control
          </div>
          <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-4xl lg:text-5xl">
            Welcome back to your observatory deck.
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--zenith-text-muted)] sm:text-base">
            Monitor orbital activity, sky conditions, and lunar timing from a refined command center built for serious observation.
          </p>
        </div>
        <div class="rounded-[1.4rem] border border-white/15 bg-gradient-to-br from-[var(--zenith-accent)]/18 to-sky-500/10 p-4 lg:min-w-[280px]">
          <p class="text-[11px] uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]">Active site</p>
          <p class="mt-2 text-lg font-semibold text-[var(--zenith-text)]">
            {{ locationStore.currentLocation.name || 'Current Device Location' }}
          </p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text-muted)]">
            {{ formatCoordinate(locationStore.currentLocation.latitude, 'lat') }},
            {{ formatCoordinate(locationStore.currentLocation.longitude, 'lng') }}
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="card in summaryCards"
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
          <p class="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ card.value }}</p>
          <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ card.subtitle }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-6">
        <BaseCard title="Observation Status" subtitle="Live sky and weather readout" hoverable>
          <div v-if="celestialStore.weatherLoading" class="text-sm text-[var(--zenith-text-muted)]">
            Loading live weather conditions...
          </div>
          <div v-else-if="celestialStore.weatherError" class="text-sm text-[var(--zenith-warning)]">
            {{ celestialStore.weatherError }}
          </div>
          <div v-else-if="celestialStore.weather" class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4">
              <div>
                <p class="text-[11px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Observation window</p>
                <p class="mt-1 text-xl font-semibold text-[var(--zenith-text)]">{{ weatherStatus.label }}</p>
              </div>
              <span class="rounded-full px-3 py-1 text-sm font-medium" :class="weatherStatus.classes">
                {{ weatherStatus.label }}
              </span>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Temperature</p>
                <p class="mt-1 font-mono text-lg font-semibold text-[var(--zenith-text)]">{{ celestialStore.weather.temperature.toFixed(1) }}°C</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Visibility</p>
                <p class="mt-1 font-mono text-lg font-semibold text-[var(--zenith-text)]">{{ celestialStore.weather.visibility }} km</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Humidity</p>
                <p class="mt-1 font-mono text-lg font-semibold text-[var(--zenith-text)]">{{ celestialStore.weather.humidity }}%</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Wind</p>
                <p class="mt-1 font-mono text-lg font-semibold text-[var(--zenith-text)]">{{ celestialStore.weather.windSpeed }} km/h</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <div class="grid gap-6 lg:grid-cols-2">
          <BaseCard title="Solar Timeline" subtitle="Sunrise and twilight windows" hoverable>
            <div v-if="celestialStore.solarLoading" class="text-sm text-[var(--zenith-text-muted)]">
              Loading solar information...
            </div>
            <div v-else-if="celestialStore.solarError" class="text-sm text-[var(--zenith-warning)]">
              {{ celestialStore.solarError }}
            </div>
            <div v-else-if="celestialStore.solarInfo" class="space-y-3">
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Sunrise</p>
                <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ formatTime(celestialStore.solarInfo.sunrise) }}</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Sunset</p>
                <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ formatTime(celestialStore.solarInfo.sunset) }}</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Civil Twilight</p>
                <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ formatTwilightRange(celestialStore.solarInfo.civilTwilight) }}</p>
              </div>
              <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Astronomical Twilight</p>
                <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ formatTwilightRange(celestialStore.solarInfo.astronomicalTwilight) }}</p>
              </div>
            </div>
          </BaseCard>

          <BaseCard title="Moon Phase" subtitle="Lunar visibility and timing" hoverable>
            <div v-if="celestialStore.moonLoading" class="text-sm text-[var(--zenith-text-muted)]">
              Loading moon information...
            </div>
            <div v-else-if="celestialStore.moonError" class="text-sm text-[var(--zenith-warning)]">
              {{ celestialStore.moonError }}
            </div>
            <div v-else-if="celestialStore.moonInfo" class="space-y-3">
              <div class="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 14a8 8 0 11-8-8 8 8 0 008 8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-[var(--zenith-text)]">{{ celestialStore.moonInfo.phase }}</p>
                  <p class="text-xs text-[var(--zenith-text-muted)]">{{ celestialStore.moonInfo.illumination }}% illumination</p>
                </div>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                  <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Moonrise</p>
                  <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ celestialStore.moonInfo.moonrise ? formatTime(celestialStore.moonInfo.moonrise) : '—' }}</p>
                </div>
                <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
                  <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Moonset</p>
                  <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ celestialStore.moonInfo.moonset ? formatTime(celestialStore.moonInfo.moonset) : '—' }}</p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <div class="space-y-6">
        <BaseCard title="Observation Score" subtitle="Readiness for tonight" hoverable class="overflow-hidden">
          <div class="rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-[var(--zenith-accent)]/20 via-sky-500/15 to-transparent p-5">
            <div class="flex flex-col items-center gap-4 text-center">
              <div
                class="flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-[var(--zenith-surface)]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                :style="{ background: `conic-gradient(var(--zenith-accent) ${observationScore}%, rgba(255,255,255,0.08) 0)` }"
              >
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--zenith-surface)]/95">
                  <span class="text-3xl font-semibold text-[var(--zenith-text)]">{{ observationScore }}</span>
                </div>
              </div>
              <div>
                <p class="text-lg font-semibold text-[var(--zenith-text)]">{{ observationLabel }}</p>
                <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">
                  {{ celestialStore.weather ? `${celestialStore.weather.visibility} km visibility with ${celestialStore.weather.cloudCover}% cloud cover` : 'Awaiting live weather data' }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="Quick Actions" subtitle="Jump straight into your workflow" hoverable>
          <div class="grid gap-3 sm:grid-cols-2">
            <RouterLink
              v-for="action in quickActions"
              :key="action.title"
              :to="action.to"
              class="group rounded-[1.2rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--zenith-accent)]/40 hover:shadow-[0_14px_36px_rgba(124,92,255,0.16)]"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)] transition-transform duration-200 group-hover:scale-105">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="action.icon" />
                </svg>
              </div>
              <p class="mt-3 font-semibold text-[var(--zenith-text)]">{{ action.title }}</p>
              <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ action.description }}</p>
            </RouterLink>
          </div>
        </BaseCard>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <BaseCard title="Visible Sky Objects" subtitle="Currently above the horizon" hoverable>
        <div v-if="celestialStore.visibleObjectsLoading" class="text-sm text-[var(--zenith-text-muted)]">
          Loading visible objects...
        </div>
        <div v-else-if="celestialStore.visibleObjectsError" class="text-sm text-[var(--zenith-warning)]">
          {{ celestialStore.visibleObjectsError }}
        </div>
        <div v-else class="space-y-3">
          <PlanetCard
            v-for="obj in celestialStore.currentlyVisible.slice(0, 3)"
            :key="obj.id"
            :object="obj"
            compact
            class="!border-white/10 !bg-white/5 !shadow-none"
          />
          <div v-if="celestialStore.currentlyVisible.length === 0" class="text-sm text-[var(--zenith-text-muted)]">
            No objects are currently above the horizon from your location.
          </div>
          <RouterLink to="/radar" class="inline-flex text-sm font-medium text-[var(--zenith-accent)] hover:underline">
            View all on Sky Radar
          </RouterLink>
        </div>
      </BaseCard>

      <div class="space-y-6">
        <ISSPanel
          :position="celestialStore.issPosition"
          :loading="celestialStore.loading"
          :error="celestialStore.issError"
          @refresh="celestialStore.refreshISSPosition"
        />

        <BaseCard title="Recent Activity" subtitle="Latest mission updates" hoverable>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivity"
              :key="activity.title"
              class="flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3"
            >
              <div class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--zenith-accent)] animate-pulse-glow" />
              <div class="min-w-0 flex-1">
                <p class="font-medium text-[var(--zenith-text)]">{{ activity.title }}</p>
                <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ activity.detail }}</p>
              </div>
              <span class="text-xs font-medium uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">{{ activity.time }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>
