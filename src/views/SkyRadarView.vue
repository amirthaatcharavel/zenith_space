<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkyRadarCanvas from '@/components/astronomy/SkyRadarCanvas.vue'
import ObjectDetailsPanel from '@/components/astronomy/ObjectDetailsPanel.vue'
import { useLocationStore } from '@/stores/location.store'
import { useCelestialStore } from '@/stores/celestial.store'
import type { ObjectFilter } from '@/stores/celestial.store'
import type { VisibleObject } from '@/types'
import { formatCoordinate } from '@/utils/helpers'

const locationStore = useLocationStore()
const celestialStore = useCelestialStore()
const searchQuery = ref('')

const filters: { label: string; value: ObjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Planets', value: 'planet' },
  { label: 'Stars', value: 'star' },
  { label: 'Moon', value: 'moon' },
  { label: 'ISS', value: 'satellite' },
]

const selectedObject = computed(() => celestialStore.selectedObject)
const currentObservationTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })

const filteredObjects = computed(() => {
  const objects = celestialStore.filteredRadarObjects
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return objects
  }

  return objects.filter((object) => object.name.toLowerCase().includes(query))
})

const matchedObjectIds = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return []
  }

  return celestialStore.filteredRadarObjects
    .filter((object) => object.name.toLowerCase().includes(query))
    .map((object) => object.id)
})

const selectedObjectForPanel = computed<VisibleObject | null>(() => {
  if (!selectedObject.value) {
    return filteredObjects.value[0] ?? null
  }

  return selectedObject.value
})

const visibilityQuality = computed(() => {
  const weather = celestialStore.weather
  const moonInfo = celestialStore.moonInfo

  if (!weather || !moonInfo) {
    return {
      label: 'Assessing conditions',
      score: 0,
      description: 'Visibility data is still being loaded.',
    }
  }

  const cloudScore = 100 - Math.min(weather.cloudCover, 100)
  const humidityScore = Math.max(0, 100 - weather.humidity)
  const visibilityScore = Math.min(100, weather.visibility * 8)
  const moonScore = Math.max(0, 100 - moonInfo.illumination)
  const score = Math.round((cloudScore * 0.3 + humidityScore * 0.25 + visibilityScore * 0.25 + moonScore * 0.2))

  let label = 'Poor'
  if (score >= 80) label = 'Excellent'
  else if (score >= 60) label = 'Good'
  else if (score >= 40) label = 'Fair'

  return {
    label,
    score,
    description: `${weather.cloudCover}% cloud cover, ${weather.humidity}% humidity, and ${weather.visibility} km visible range.`,
  }
})

function getDirectionLabel(azimuth: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(((azimuth % 360) + 360) % 360 / 45) % 8
  return directions[index]
}

const summaryCards = computed(() => [
  {
    label: 'Visible objects',
    value: celestialStore.filteredRadarObjects.length.toString(),
    subtitle: 'Tracked in your sky',
    icon: 'M5 12h14M12 5v14',
    accent: 'from-cyan-500/20 to-sky-500/20',
    iconColor: 'text-cyan-300',
  },
  {
    label: 'Observation quality',
    value: visibilityQuality.value.label,
    subtitle: `${visibilityQuality.value.score}/100 readiness`,
    icon: 'M4 12l2-2 4 4 10-10 2 2-12 12-6-6z',
    accent: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-300',
  },
  {
    label: 'Cloud cover',
    value: celestialStore.weather ? `${celestialStore.weather.cloudCover}%` : '—',
    subtitle: 'Atmospheric clarity',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    accent: 'from-slate-500/20 to-blue-500/20',
    iconColor: 'text-slate-300',
  },
  {
    label: 'Moon illumination',
    value: celestialStore.moonInfo ? `${celestialStore.moonInfo.illumination}%` : '—',
    subtitle: 'Lunar brightness',
    icon: 'M20 14a8 8 0 11-8-8 8 8 0 008 8z',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-300',
  },
  {
    label: 'Current direction',
    value: getDirectionLabel(selectedObjectForPanel.value?.azimuth ?? 0),
    subtitle: 'Most relevant heading',
    icon: 'M12 3l7 18-7-3-7 3 7-18z',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-300',
  },
])

const observationTips = computed(() => {
  const tips: Array<{ icon: string; title: string; copy: string }> = []
  const weather = celestialStore.weather
  const moonInfo = celestialStore.moonInfo

  if (!weather || !moonInfo) {
    return [{ icon: 'M12 3v4m0 10v4m9-9h-4M7 12H3m9-6l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2', title: 'Stand by for the next feed', copy: 'Live observation conditions will appear as soon as the data refreshes.' }]
  }

  if (weather.cloudCover > 45) {
    tips.push({ icon: 'M20 16.5A4.5 4.5 0 0015.5 12H14a5 5 0 10-8.9 3.1', title: 'Cloud cover is elevated', copy: 'Prioritize brighter targets and keep your exposure plan flexible.' })
  }

  if (moonInfo.illumination > 60) {
    tips.push({ icon: 'M20 14a8 8 0 11-8-8 8 8 0 008 8z', title: 'Moonlight is strong', copy: 'Lunar glare may reduce contrast for faint deep-sky observations.' })
  }

  if (weather.visibility >= 12) {
    tips.push({ icon: 'M5 12h14M12 5l7 7-7 7-7-7 7-7z', title: 'Visibility is excellent', copy: 'This is an ideal window for scanning planets, bright stars, and ISS passes.' })
  }

  if (tips.length === 0) {
    tips.push({ icon: 'M12 8v4l3 3', title: 'Conditions are steady', copy: 'A balanced window for close tracking and object comparison.' })
  }

  return tips.slice(0, 4)
})

function handleSelect(id: string): void {
  celestialStore.setSelectedObject(id)
}

function clearSearch(): void {
  searchQuery.value = ''
}

onMounted(() => {
  void celestialStore.initialize()
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
            <span class="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse-glow" />
            Observatory radar
          </div>
          <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-4xl lg:text-5xl">
            Sky Radar
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--zenith-text-muted)] sm:text-base">
            Follow visible stars, planets, the Moon, and the ISS in a cinematic observatory view tailored to your current site and sky conditions.
          </p>
        </div>
        <div class="rounded-[1.3rem] border border-white/15 bg-gradient-to-br from-[var(--zenith-accent)]/14 to-sky-500/12 p-4 lg:min-w-[280px]">
          <p class="text-[11px] uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]">Active observation</p>
          <p class="mt-2 text-lg font-semibold text-[var(--zenith-text)]">
            {{ locationStore.currentLocation.name || 'Current observation point' }}
          </p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text-muted)]">
            {{ formatCoordinate(locationStore.currentLocation.latitude, 'lat') }},
            {{ formatCoordinate(locationStore.currentLocation.longitude, 'lng') }}
          </p>
          <p class="mt-3 text-sm text-[var(--zenith-text-subtle)]">Observation time · {{ currentObservationTime }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

    <div class="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <BaseCard title="Filters" subtitle="Refine the visible sky" padding="sm" hoverable>
        <div class="flex flex-wrap gap-2 xl:flex-col">
          <BaseButton
            v-for="filter in filters"
            :key="filter.value"
            :variant="celestialStore.activeFilter === filter.value ? 'primary' : 'ghost'"
            size="sm"
            @click="celestialStore.setActiveFilter(filter.value)"
          >
            {{ filter.label }}
          </BaseButton>
        </div>
      </BaseCard>

      <BaseCard title="Interactive Radar" subtitle="Azimuth / altitude view" class="min-h-[500px]" hoverable>
        <div class="space-y-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="relative w-full sm:max-w-[320px]">
              <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg class="h-4 w-4 text-[var(--zenith-text-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search objects by name"
                class="w-full rounded-[1rem] border border-white/15 bg-[var(--zenith-surface-elevated)]/80 py-2.5 pl-10 pr-4 text-sm text-[var(--zenith-text)] placeholder:text-[var(--zenith-text-subtle)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 focus:border-[var(--zenith-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--zenith-accent)]/25"
              />
            </div>
            <BaseButton v-if="searchQuery" variant="ghost" size="sm" @click="clearSearch">
              Clear
            </BaseButton>
          </div>

          <SkyRadarCanvas
            :objects="filteredObjects"
            :selected-id="celestialStore.selectedObjectId"
            :highlighted-ids="matchedObjectIds"
            @select="handleSelect"
          />
        </div>
      </BaseCard>

      <ObjectDetailsPanel
        :object="selectedObjectForPanel"
        :visibility-quality="visibilityQuality"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <BaseCard title="Visible Objects" subtitle="Focused list of tracked celestial bodies" hoverable>
        <div class="space-y-3">
          <button
            v-for="object in filteredObjects"
            :key="object.id"
            type="button"
            class="flex w-full items-center justify-between rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--zenith-accent)]/40 hover:bg-white/5"
            :class="celestialStore.selectedObjectId === object.id ? 'border-[var(--zenith-accent)]/50 bg-[var(--zenith-accent)]/12 shadow-[0_14px_36px_rgba(124,92,255,0.16)]' : ''"
            @click="handleSelect(object.id)"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/18 to-sky-500/12 text-[var(--zenith-accent)]">
                <svg v-if="object.type === 'moon'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 14a8 8 0 11-8-8 8 8 0 008 8z" />
                </svg>
                <svg v-else-if="object.type === 'satellite'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                </svg>
                <svg v-else-if="object.type === 'planet'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 9.911c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-[var(--zenith-text)]">{{ object.name }}</p>
                <p class="mt-0.5 text-xs capitalize text-[var(--zenith-text-subtle)]">{{ object.type }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--zenith-text-subtle)]">
                {{ object.visible ? 'Visible' : 'Horizon' }}
              </span>
              <span class="font-mono text-sm text-[var(--zenith-text)]">{{ object.magnitude }}</span>
            </div>
          </button>
          <p v-if="filteredObjects.length === 0" class="rounded-[1.1rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-[var(--zenith-text-muted)]">
            No objects match your current search.
          </p>
        </div>
      </BaseCard>

      <BaseCard title="Observation Tips" subtitle="Recommended viewing cues" hoverable>
        <div class="space-y-3">
          <div
            v-for="tip in observationTips"
            :key="tip.title"
            class="flex gap-3 rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="tip.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-[var(--zenith-text)]">{{ tip.title }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--zenith-text-muted)]">{{ tip.copy }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
