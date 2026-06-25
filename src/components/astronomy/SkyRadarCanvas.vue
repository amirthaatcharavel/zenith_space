<script setup lang="ts">
import { computed } from 'vue'
import type { VisibleObject } from '@/types'
import CelestialObjectMarker from '@/components/astronomy/CelestialObjectMarker.vue'

interface Props {
  objects: VisibleObject[]
  selectedId?: string | null
  highlightedIds?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
  highlightedIds: () => [],
})

const emit = defineEmits<{
  select: [id: string]
}>()

const radarSize = 360
const center = radarSize / 2
const radius = center - 24

const plottedObjects = computed(() => props.objects.map((object) => {
  const angleRad = ((object.azimuth - 90) * Math.PI) / 180
  const distance = Math.max(0, Math.min(radius, (object.altitude / 90) * radius))

  return {
    ...object,
    x: center + distance * Math.cos(angleRad),
    y: center + distance * Math.sin(angleRad),
  }
}))

function handleSelect(id: string): void {
  emit('select', id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="overflow-hidden rounded-[1.4rem] border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.2),_transparent_55%),linear-gradient(145deg,rgba(15,20,38,0.96),rgba(6,8,20,0.96))] p-3 shadow-[0_30px_70px_rgba(3,7,18,0.28)]">
      <svg
        :width="radarSize"
        :height="radarSize"
        :viewBox="`0 0 ${radarSize} ${radarSize}`"
        class="mx-auto block max-w-full"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.25)" />
            <stop offset="60%" stop-color="rgba(124, 92, 255, 0.08)" />
            <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>

        <circle :cx="center" :cy="center" :r="radius + 10" fill="url(#radarGlow)" />
        <circle :cx="center" :cy="center" :r="radius" fill="none" stroke="rgba(148,163,255,0.35)" stroke-width="1.2" />
        <circle :cx="center" :cy="center" :r="radius * 0.66" fill="none" stroke="rgba(148,163,255,0.18)" stroke-width="0.8" stroke-dasharray="4 4" />
        <circle :cx="center" :cy="center" :r="radius * 0.33" fill="none" stroke="rgba(148,163,255,0.18)" stroke-width="0.8" stroke-dasharray="4 4" />
        <line :x1="center" :y1="center - radius" :x2="center" :y2="center + radius" stroke="rgba(148,163,255,0.18)" stroke-width="0.7" />
        <line :x1="center - radius" :y1="center" :x2="center + radius" :y2="center" stroke="rgba(148,163,255,0.18)" stroke-width="0.7" />

        <g class="animate-radar-sweep" style="transform-origin: center center;">
          <line :x1="center" :y1="center" :x2="center + radius" :y2="center" stroke="rgba(56,189,248,0.35)" stroke-width="1.5" stroke-linecap="round" />
          <circle :cx="center" :cy="center" :r="radius * 0.78" fill="none" stroke="rgba(56,189,248,0.16)" stroke-width="1" />
        </g>

        <text :x="center" :y="16" text-anchor="middle" class="fill-[var(--zenith-text-subtle)] text-[10px]">N</text>
        <text :x="radarSize - 16" :y="center + 4" text-anchor="end" class="fill-[var(--zenith-text-subtle)] text-[10px]">E</text>
        <text :x="center" :y="radarSize - 8" text-anchor="middle" class="fill-[var(--zenith-text-subtle)] text-[10px]">S</text>
        <text :x="12" :y="center + 4" class="fill-[var(--zenith-text-subtle)] text-[10px]">W</text>

        <circle :cx="center" :cy="center" r="5" fill="var(--zenith-accent)" />
        <circle :cx="center" :cy="center" r="10" fill="none" stroke="rgba(124,92,255,0.3)" stroke-width="1" />

        <g v-for="object in plottedObjects" :key="object.id">
          <CelestialObjectMarker
            :object="object"
            :selected="props.selectedId === object.id"
            :highlighted="props.highlightedIds.includes(object.id)"
            @select="handleSelect"
          />
        </g>
      </svg>
    </div>

    <div class="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
      <span class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"><span class="h-2.5 w-2.5 rounded-full bg-amber-300" /> Stars</span>
      <span class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"><span class="h-2.5 w-2.5 rounded-full bg-cyan-300" /> Planets</span>
      <span class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"><span class="h-2.5 w-2.5 rounded-full bg-violet-300" /> Moon</span>
      <span class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"><span class="h-2.5 w-2.5 rounded-full bg-rose-400" /> ISS</span>
    </div>
  </div>
</template>
