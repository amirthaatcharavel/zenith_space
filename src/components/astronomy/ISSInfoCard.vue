<script setup lang="ts">
import type { ISSPosition } from '@/types'

interface Props {
  position: ISSPosition
  loading?: boolean
  lastUpdated?: string | null
  locationName?: string | null
}

withDefaults(defineProps<Props>(), {
  loading: false,
  lastUpdated: null,
  locationName: null,
})
</script>

<template>
  <div class="rounded-[1.4rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-5 shadow-[0_18px_44px_rgba(3,7,18,0.16)] backdrop-blur-xl">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-[var(--zenith-text)]">Live telemetry</h3>
        <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">Current orbital state and observer context</p>
      </div>
      <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--zenith-text-subtle)]">
        {{ loading ? 'Refreshing' : 'Live' }}
      </span>
    </div>

    <div class="mt-4 rounded-[1.15rem] border border-white/10 bg-gradient-to-br from-[var(--zenith-accent)]/10 to-sky-500/10 p-3">
      <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Observer</p>
      <p class="mt-1 text-sm font-medium text-[var(--zenith-text)]">{{ locationName || 'Current observation point' }}</p>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Latitude</p>
        <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ position.latitude.toFixed(4) }}°</p>
      </div>
      <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Longitude</p>
        <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ position.longitude.toFixed(4) }}°</p>
      </div>
      <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Altitude</p>
        <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ position.altitude.toFixed(1) }} km</p>
      </div>
      <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Velocity</p>
        <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ position.velocity.toFixed(1) }} km/h</p>
      </div>
    </div>

    <div class="mt-4 rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3 text-sm text-[var(--zenith-text-muted)]">
      <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Timestamp</p>
      <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ lastUpdated ?? '—' }}</p>
    </div>
  </div>
</template>
