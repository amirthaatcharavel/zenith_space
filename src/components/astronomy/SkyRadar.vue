<script setup lang="ts">
import { computed } from 'vue'
import type { CelestialObject } from '@/types'

interface Props {
  objects: CelestialObject[]
  selectedId?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
}>()

const radarSize = 280
const center = radarSize / 2
const radius = center - 20

const plottedObjects = computed(() =>
  props.objects.map((obj) => {
    const angleRad = ((obj.azimuth - 90) * Math.PI) / 180
    const distance = (obj.altitude / 90) * radius
    return {
      ...obj,
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    }
  }),
)

const typeColors: Record<string, string> = {
  planet: '#7C5CFC',
  star: '#FBBF24',
  galaxy: '#34D399',
  nebula: '#F472B6',
  comet: '#60A5FA',
  satellite: '#F87171',
}

function getColor(type: string): string {
  return typeColors[type] ?? '#7C5CFC'
}
</script>

<template>
  <div class="relative flex items-center justify-center">
    <svg
      :width="radarSize"
      :height="radarSize"
      :viewBox="`0 0 ${radarSize} ${radarSize}`"
      class="max-w-full"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--zenith-border)"
        stroke-width="1"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius * 0.66"
        fill="none"
        stroke="var(--zenith-border-subtle)"
        stroke-width="0.5"
        stroke-dasharray="4 4"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius * 0.33"
        fill="none"
        stroke="var(--zenith-border-subtle)"
        stroke-width="0.5"
        stroke-dasharray="4 4"
      />

      <line
        :x1="center"
        :y1="center - radius"
        :x2="center"
        :y2="center + radius"
        stroke="var(--zenith-border-subtle)"
        stroke-width="0.5"
      />
      <line
        :x1="center - radius"
        :y1="center"
        :x2="center + radius"
        :y2="center"
        stroke="var(--zenith-border-subtle)"
        stroke-width="0.5"
      />

      <text
        :x="center"
        :y="12"
        text-anchor="middle"
        class="fill-[var(--zenith-text-subtle)] text-[8px]"
      >
        N
      </text>
      <text
        :x="radarSize - 8"
        :y="center + 3"
        text-anchor="end"
        class="fill-[var(--zenith-text-subtle)] text-[8px]"
      >
        E
      </text>
      <text
        :x="center"
        :y="radarSize - 4"
        text-anchor="middle"
        class="fill-[var(--zenith-text-subtle)] text-[8px]"
      >
        S
      </text>
      <text
        :x="8"
        :y="center + 3"
        class="fill-[var(--zenith-text-subtle)] text-[8px]"
      >
        W
      </text>

      <g
        :style="{ transformOrigin: `${center}px ${center}px` }"
        class="animate-radar-sweep"
      >
        <line
          :x1="center"
          :y1="center"
          :x2="center"
          :y2="center - radius"
          stroke="var(--zenith-accent)"
          stroke-width="1"
          opacity="0.3"
        />
      </g>

      <g
        v-for="obj in plottedObjects"
        :key="obj.id"
        class="cursor-pointer"
        @click="emit('select', obj.id)"
      >
        <circle
          :cx="obj.x"
          :cy="obj.y"
          :r="props.selectedId === obj.id ? 8 : 5"
          :fill="getColor(obj.type)"
          :opacity="obj.visible ? 1 : 0.3"
          :stroke="props.selectedId === obj.id ? 'var(--zenith-text)' : 'none'"
          stroke-width="2"
        />
        <title>{{ obj.name }} — Alt {{ obj.altitude }}° Az {{ obj.azimuth }}°</title>
      </g>

      <circle
        :cx="center"
        :cy="center"
        r="3"
        fill="var(--zenith-accent)"
        class="animate-pulse-glow"
      />
    </svg>

    <div class="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-3 px-2">
      <div
        v-for="(color, type) in typeColors"
        :key="type"
        class="flex items-center gap-1"
      >
        <span
          class="inline-block h-2 w-2 rounded-full"
          :style="{ backgroundColor: color }"
        />
        <span class="text-[10px] capitalize text-[var(--zenith-text-subtle)]">{{ type }}</span>
      </div>
    </div>
  </div>
</template>
