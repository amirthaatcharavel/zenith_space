<script setup lang="ts">
import type { VisibleObject } from '@/types'

interface PlottedObject extends VisibleObject {
  x: number
  y: number
}

interface Props {
  object: PlottedObject
  selected?: boolean
  highlighted?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  highlighted: false,
})

const emit = defineEmits<{
  select: [id: string]
}>()

function getMarkerColor(type: VisibleObject['type']): string {
  if (type === 'moon') return 'var(--zenith-accent)'
  if (type === 'star') return '#fbbf24'
  if (type === 'planet') return '#38bdf8'
  if (type === 'satellite') return 'var(--zenith-danger)'
  return 'var(--zenith-success)'
}
</script>

<template>
  <g
    class="marker-shell cursor-pointer"
    role="button"
    tabindex="0"
    :aria-label="`${object.name} marker`"
    @click="emit('select', object.id)"
    @keydown.enter.prevent="emit('select', object.id)"
    @keydown.space.prevent="emit('select', object.id)"
  >
    <circle
      :cx="object.x"
      :cy="object.y"
      :r="selected ? 10 : highlighted ? 8 : 6"
      :fill="getMarkerColor(object.type)"
      :opacity="object.visible ? 1 : 0.45"
      :stroke="selected ? 'rgba(255,255,255,0.9)' : highlighted ? 'rgba(124,92,255,0.85)' : 'rgba(255,255,255,0.2)'"
      stroke-width="1.6"
    />
    <circle
      :cx="object.x"
      :cy="object.y"
      :r="selected ? 15 : highlighted ? 12 : 9"
      fill="none"
      :stroke="selected ? 'rgba(56,189,248,0.34)' : highlighted ? 'rgba(124,92,255,0.25)' : 'rgba(255,255,255,0.08)'"
      stroke-width="1"
      :stroke-dasharray="highlighted ? '3 3' : '0'"
    />
    <circle
      v-if="selected || highlighted"
      :cx="object.x"
      :cy="object.y"
      :r="selected ? 18 : 14"
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      stroke-width="1.2"
      class="animate-pulse-glow"
    />
    <title>{{ object.name }} — Alt {{ object.altitude }}° Az {{ object.azimuth }}°</title>
  </g>
</template>

<style scoped>
.marker-shell {
  transform-origin: center center;
  transition: transform 180ms ease;
}

.marker-shell:hover {
  transform: scale(1.08);
}
</style>
