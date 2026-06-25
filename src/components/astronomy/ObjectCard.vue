<script setup lang="ts">
import type { CelestialObject } from '@/types'
import { formatMagnitude } from '@/utils/helpers'

interface Props {
  object: CelestialObject
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
})

const emit = defineEmits<{
  select: [id: string]
}>()

const typeBadgeColors: Record<string, string> = {
  planet: 'bg-[#7C5CFC]/20 text-[#7C5CFC]',
  star: 'bg-[#FBBF24]/20 text-[#FBBF24]',
  galaxy: 'bg-[#34D399]/20 text-[#34D399]',
  nebula: 'bg-[#F472B6]/20 text-[#F472B6]',
  comet: 'bg-[#60A5FA]/20 text-[#60A5FA]',
  satellite: 'bg-[#F87171]/20 text-[#F87171]',
}
</script>

<template>
  <button
    type="button"
    class="w-full rounded-lg border p-3 text-left transition-all duration-200"
    :class="
      props.selected
        ? 'border-[var(--zenith-accent)] bg-[var(--zenith-accent-muted)]'
        : 'border-[var(--zenith-border)] bg-[var(--zenith-surface-elevated)] hover:border-[var(--zenith-accent)]'
    "
    @click="emit('select', object.id)"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="truncate font-medium text-[var(--zenith-text)]">
        {{ object.name }}
      </span>
      <span
        class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
        :class="typeBadgeColors[object.type] ?? typeBadgeColors.planet"
      >
        {{ object.type }}
      </span>
    </div>
    <div class="mt-2 flex items-center gap-4 text-xs text-[var(--zenith-text-muted)]">
      <span>Alt {{ object.altitude }}°</span>
      <span>Az {{ object.azimuth }}°</span>
      <span v-if="object.magnitude !== undefined">
        Mag {{ formatMagnitude(object.magnitude) }}
      </span>
      <span
        class="ml-auto"
        :class="object.visible ? 'text-[var(--zenith-success)]' : 'text-[var(--zenith-text-subtle)]'"
      >
        {{ object.visible ? 'Visible' : 'Hidden' }}
      </span>
    </div>
  </button>
</template>
