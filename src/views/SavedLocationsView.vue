<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseEmptyState from '@/components/ui/BaseEmptyState.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import CoordinatePicker from '@/components/astronomy/CoordinatePicker.vue'
import { useLocationStore } from '@/stores/location.store'
import { formatCoordinate, formatDateTime } from '@/utils/helpers'

type FilterMode = 'all' | 'active' | 'default' | 'recent'
type SortMode = 'recent' | 'name' | 'coordinates'

const locationStore = useLocationStore()

const showAddModal = ref(false)
const newLocationName = ref('')
const newLat = ref(String(locationStore.currentLocation.latitude))
const newLng = ref(String(locationStore.currentLocation.longitude))
const searchQuery = ref('')
const selectedFilter = ref<FilterMode>('all')
const sortMode = ref<SortMode>('recent')

const activeLocationLabel = computed(() => {
  if (locationStore.currentLocation?.name) {
    return locationStore.currentLocation.name
  }

  if (locationStore.defaultLocation?.name) {
    return locationStore.defaultLocation.name
  }

  return 'No active site selected'
})

const stats = computed(() => {
  const locations = locationStore.savedLocations
  const recentCount = locations.filter((loc) => {
    if (!loc.savedAt) return false
    const ageInDays = (Date.now() - new Date(loc.savedAt).getTime()) / (1000 * 60 * 60 * 24)
    return ageInDays <= 7
  }).length

  return [
    {
      label: 'Saved locations',
      value: locations.length,
      detail: 'Observation sites',
      icon: 'M12 21l-7-4V5l7-4 7 4v12l-7 4z',
      accent: 'from-cyan-500/20 to-sky-500/20',
      iconColor: 'text-cyan-300',
    },
    {
      label: 'Active location',
      value: activeLocationLabel.value,
      detail: 'Currently in use',
      icon: 'M13 16V8m0 0l3 3m-3-3l-3 3M5 20h14',
      accent: 'from-violet-500/20 to-indigo-500/20',
      iconColor: 'text-violet-300',
    },
    {
      label: 'Default location',
      value: locationStore.defaultLocation?.name ?? 'None',
      detail: 'Primary reference',
      icon: 'M12 3l7 5v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V8l7-5z',
      accent: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-300',
    },
    {
      label: 'Recently added',
      value: recentCount,
      detail: 'Added in the last week',
      icon: 'M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      accent: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-300',
    },
  ]
})

const filteredLocations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const locations = [...locationStore.savedLocations]

  const filtered = locations.filter((loc) => {
    const matchQuery = !query || [loc.name, loc.latitude, loc.longitude].some((value) => String(value).toLowerCase().includes(query))
    const matchFilter = selectedFilter.value === 'all'
      || (selectedFilter.value === 'active' && loc.id === locationStore.currentLocation.id)
      || (selectedFilter.value === 'default' && loc.isDefault)
      || (selectedFilter.value === 'recent' && loc.savedAt && (Date.now() - new Date(loc.savedAt).getTime()) <= 7 * 24 * 60 * 60 * 1000)

    return matchQuery && matchFilter
  })

  filtered.sort((left, right) => {
    if (sortMode.value === 'name') {
      return left.name.localeCompare(right.name)
    }

    if (sortMode.value === 'coordinates') {
      return (left.latitude - right.latitude) || (left.longitude - right.longitude)
    }

    const leftTime = left.savedAt ? new Date(left.savedAt).getTime() : 0
    const rightTime = right.savedAt ? new Date(right.savedAt).getTime() : 0
    return rightTime - leftTime
  })

  return filtered
})

const previewLocations = computed(() => locationStore.savedLocations.slice(0, 3))

onMounted(() => {
  locationStore.loadLocations()
})

function openAddModal(): void {
  newLocationName.value = ''
  newLat.value = String(locationStore.currentLocation.latitude)
  newLng.value = String(locationStore.currentLocation.longitude)
  showAddModal.value = true
}

async function handleSaveFromPicker(name: string, lat: number, lng: number): Promise<void> {
  await locationStore.saveLocation({ name, latitude: lat, longitude: lng })
  showAddModal.value = false
}

async function handleAddLocation(): Promise<void> {
  const lat = parseFloat(newLat.value)
  const lng = parseFloat(newLng.value)
  const name = newLocationName.value.trim()

  if (Number.isNaN(lat) || Number.isNaN(lng) || !name) return

  await locationStore.saveLocation({ name, latitude: lat, longitude: lng })
  showAddModal.value = false
}

function handleSetCurrent(id: string): void {
  const loc = locationStore.savedLocations.find((l) => l.id === id)
  if (loc) {
    locationStore.setCurrentLocation(loc)
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6">
    <section class="overflow-hidden rounded-[2.2rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-6 shadow-[0_32px_90px_rgba(3,7,18,0.24)] backdrop-blur-2xl lg:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--zenith-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--zenith-accent)] animate-pulse-glow" />
            Observation planning
          </div>
          <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-4xl">
            Saved Locations
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--zenith-text-muted)] sm:text-base">
            Curate the places you return to for skywatching, with a polished workflow for switching, prioritizing, and managing each site.
          </p>
        </div>
        <div class="flex flex-col gap-3 rounded-[1.35rem] border border-white/15 bg-gradient-to-br from-[var(--zenith-accent)]/12 to-sky-500/10 p-4 lg:min-w-[320px]">
          <p class="text-[10px] uppercase tracking-[0.3em] text-[var(--zenith-text-subtle)]">Active site</p>
          <p class="text-lg font-semibold text-[var(--zenith-text)]">{{ activeLocationLabel }}</p>
          <p class="text-sm text-[var(--zenith-text-muted)]">Ready for observation planning and live sky conditions.</p>
          <BaseButton block @click="openAddModal">
            Add Location
          </BaseButton>
        </div>
      </div>
    </section>

    <BaseLoader v-if="locationStore.loading" label="Loading locations" />

    <template v-else>
      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="card in stats"
          :key="card.label"
          class="group rounded-[1.35rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_16px_50px_rgba(3,7,18,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(124,92,255,0.16)]"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br" :class="card.accent">
              <svg class="h-5 w-5" :class="card.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="card.icon" />
              </svg>
            </div>
            <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
              Live
            </span>
          </div>
          <div class="mt-6">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">{{ card.label }}</p>
            <p class="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ card.value }}</p>
            <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ card.detail }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-[1.6rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_18px_44px_rgba(3,7,18,0.16)] backdrop-blur-xl lg:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-xl">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zenith-text-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search by name or coordinates"
              class="w-full rounded-[1rem] border border-white/15 bg-[var(--zenith-surface-elevated)]/80 py-3 pl-10 pr-4 text-sm text-[var(--zenith-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] outline-none transition-all duration-300 placeholder:text-[var(--zenith-text-subtle)] focus:border-[var(--zenith-accent)] focus:ring-2 focus:ring-[var(--zenith-accent)]/25"
            />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in [
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'default', label: 'Default' },
                  { key: 'recent', label: 'Recent' },
                ]"
                :key="filter.key"
                class="rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] transition-all duration-200 motion-reduce:transition-none"
                :class="selectedFilter === filter.key
                  ? 'border-[var(--zenith-accent)] bg-[var(--zenith-accent)]/15 text-[var(--zenith-accent)] shadow-[0_0_0_1px_rgba(124,92,255,0.16)]'
                  : 'border-white/10 bg-white/5 text-[var(--zenith-text-muted)] hover:border-[var(--zenith-accent)]/40 hover:text-[var(--zenith-text)]'"
                @click="selectedFilter = filter.key as FilterMode"
              >
                {{ filter.label }}
              </button>
            </div>
            <label class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--zenith-text-muted)]">
              <span class="text-[10px] uppercase tracking-[0.24em]">Sort</span>
              <select v-model="sortMode" class="bg-transparent text-sm text-[var(--zenith-text)] outline-none">
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="coordinates">Coordinates</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <div v-if="locationStore.savedLocations.length > 0" class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <BaseCard title="Your sites" :subtitle="`${filteredLocations.length} visible • ${locationStore.savedLocations.length} saved`" hoverable>
          <div v-if="filteredLocations.length > 0" class="space-y-3">
            <article
              v-for="loc in filteredLocations"
              :key="loc.id"
              class="group relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-[var(--zenith-surface-elevated)]/80 p-4 shadow-[0_18px_44px_rgba(3,7,18,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(124,92,255,0.16)] motion-reduce:transition-none"
              :class="loc.id === locationStore.currentLocation.id ? 'border-[var(--zenith-accent)]/60 shadow-[0_0_24px_rgba(124,92,255,0.18)]' : ''"
            >
              <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-semibold text-[var(--zenith-text)]">{{ loc.name }}</h3>
                    <span
                      v-if="loc.id === locationStore.currentLocation.id"
                      class="rounded-full border border-[var(--zenith-accent)]/40 bg-[var(--zenith-accent)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--zenith-accent)]"
                    >
                      Active
                    </span>
                    <span
                      v-if="loc.isDefault"
                      class="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300"
                    >
                      Default
                    </span>
                  </div>
                  <div class="rounded-[1.05rem] border border-white/10 bg-white/5 p-3">
                    <p class="font-mono text-sm text-[var(--zenith-text)]">
                      {{ formatCoordinate(loc.latitude, 'lat') }} · {{ formatCoordinate(loc.longitude, 'lng') }}
                    </p>
                    <p class="mt-2 text-sm text-[var(--zenith-text-muted)]">
                      Added {{ loc.savedAt ? formatDateTime(loc.savedAt) : 'recently' }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <BaseButton variant="secondary" size="sm" @click="handleSetCurrent(loc.id)">
                    Select
                  </BaseButton>
                  <BaseButton
                    v-if="!loc.isDefault"
                    variant="ghost"
                    size="sm"
                    @click="locationStore.setDefaultLocation(loc.id)"
                  >
                    Set Default
                  </BaseButton>
                  <BaseButton variant="danger" size="sm" @click="locationStore.removeLocation(loc.id)">
                    Delete
                  </BaseButton>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-[1.2rem] border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-[var(--zenith-text-muted)]">
            No locations match that search or filter yet.
          </div>
        </BaseCard>

        <div class="space-y-6">
          <BaseCard title="Mini map preview" subtitle="A visual glance at your favorite observation points" hoverable>
            <div class="relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.24),transparent_55%),linear-gradient(140deg,rgba(6,8,20,0.95),rgba(16,24,46,0.95))] p-4">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.12),transparent_45%)]" />
              <div class="relative h-56 rounded-[1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]">
                <div class="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_68px),repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_68px)]" />
                <div class="absolute left-[20%] top-[25%] h-20 w-20 rounded-full border border-white/10 bg-white/5" />
                <div class="absolute bottom-[20%] right-[15%] h-24 w-24 rounded-full border border-white/10 bg-white/5" />
                <div
                  v-for="(loc, index) in previewLocations"
                  :key="loc.id"
                  class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[var(--zenith-accent)]/80 p-2 shadow-[0_0_16px_rgba(124,92,255,0.3)]"
                  :style="{ left: `${18 + index * 26}%`, top: `${24 + index * 16}%` }"
                >
                  <span class="block h-2.5 w-2.5 rounded-full bg-white" />
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between gap-2 text-sm text-[var(--zenith-text-muted)]">
                <span>Active view synchronized with your planning flow</span>
                <span class="text-[var(--zenith-text)]">{{ previewLocations.length }} markers</span>
              </div>
            </div>
          </BaseCard>

          <BaseCard title="Quick insight" subtitle="What matters most right now" hoverable>
            <div class="space-y-3">
              <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
                <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Most recent</p>
                <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ locationStore.savedLocations[0]?.name || 'No saved sites yet' }}</p>
              </div>
              <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
                <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Preferred base</p>
                <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ locationStore.defaultLocation?.name || 'Set a default site' }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <BaseEmptyState
        v-else
        title="No saved locations yet"
        description="Begin building your observation workflow with a first location, then return to compare and switch between sites instantly."
      >
        <template #action>
          <BaseButton @click="openAddModal">
            Add Your First Location
          </BaseButton>
        </template>
      </BaseEmptyState>
    </template>

    <BaseModal v-model="showAddModal" title="Add Location">
      <div class="space-y-4">
        <BaseInput
          v-model="newLocationName"
          label="Location Name"
          placeholder="e.g. Backyard Observatory"
          required
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="newLat" label="Latitude" type="number" />
          <BaseInput v-model="newLng" label="Longitude" type="number" />
        </div>
        <CoordinatePicker
          :latitude="parseFloat(newLat) || 0"
          :longitude="parseFloat(newLng) || 0"
          @update="(lat, lng) => { newLat = String(lat); newLng = String(lng) }"
          @save="handleSaveFromPicker"
        />
      </div>
      <template #footer>
        <BaseButton variant="ghost" @click="showAddModal = false">
          Cancel
        </BaseButton>
        <BaseButton @click="handleAddLocation">
          Save Location
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
