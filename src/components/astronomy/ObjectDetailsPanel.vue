<script setup lang="ts">
import type { VisibleObject } from '@/types'

interface Props {
  object: VisibleObject | null
  visibilityQuality: {
    label: string
    score: number
    description: string
  }
}

const props = defineProps<Props>()

function getObjectIcon(type: VisibleObject['type']): string {
  if (type === 'moon') return 'M20 14a8 8 0 11-8-8 8 8 0 008 8z'
  if (type === 'satellite') return 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z'
  if (type === 'planet') return 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  return 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 9.911c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
}

function getAccent(type: VisibleObject['type']): string {
  if (type === 'moon') return 'from-amber-500/20 to-orange-500/20 text-amber-300'
  if (type === 'satellite') return 'from-rose-500/20 to-fuchsia-500/20 text-rose-300'
  if (type === 'planet') return 'from-sky-500/20 to-cyan-500/20 text-sky-300'
  return 'from-violet-500/20 to-indigo-500/20 text-violet-300'
}
</script>

<template>
  <div class="rounded-[1.4rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-5 shadow-[0_18px_44px_rgba(3,7,18,0.16)] backdrop-blur-xl">
    <div v-if="props.object" class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br" :class="getAccent(props.object.type)">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getObjectIcon(props.object.type)" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-[var(--zenith-text)]">{{ props.object.name }}</h3>
            <p class="text-sm capitalize text-[var(--zenith-text-subtle)]">{{ props.object.type }}</p>
          </div>
        </div>
        <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
          {{ props.object.visible ? 'Visible' : 'Horizon' }}
        </span>
      </div>

      <p class="text-sm leading-6 text-[var(--zenith-text-muted)]">{{ props.object.description }}</p>

      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Magnitude</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ props.object.magnitude }}</p>
        </div>
        <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Altitude</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ props.object.altitude }}°</p>
        </div>
        <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Azimuth</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ props.object.azimuth }}°</p>
        </div>
        <div class="rounded-[1.05rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Visibility</p>
          <p class="mt-1 text-sm font-medium" :class="props.object.visible ? 'text-[var(--zenith-success)]' : 'text-[var(--zenith-text-subtle)]'">
            {{ props.object.visible ? 'Visible now' : 'Below horizon' }}
          </p>
        </div>
      </div>

      <div class="rounded-[1.15rem] border border-white/10 bg-gradient-to-br from-[var(--zenith-accent)]/10 to-sky-500/10 p-3">
        <div class="flex items-center justify-between gap-3">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Observation quality</p>
          <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--zenith-text-muted)]">
            {{ visibilityQuality.label }} · {{ visibilityQuality.score }}/100
          </span>
        </div>
        <p class="mt-2 text-sm leading-6 text-[var(--zenith-text-muted)]">{{ visibilityQuality.description }}</p>
      </div>
    </div>

    <div v-else class="space-y-3 text-sm text-[var(--zenith-text-muted)]">
      <p>Select an object on the radar to inspect its details.</p>
      <p class="text-[var(--zenith-text-subtle)]">Use the search box to highlight matching observations instantly.</p>
    </div>
  </div>
</template>
