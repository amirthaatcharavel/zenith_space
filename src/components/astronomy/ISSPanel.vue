<script setup lang="ts">
import { computed } from 'vue'
import type { ISSPosition } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  formatCoordinate,
  formatAltitude,
  formatVelocity,
  formatDateTime,
} from '@/utils/helpers'

interface Props {
  position: ISSPosition
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  refresh: []
}>()

const visibilityConfig = computed(() => {
  const configs = {
    visible: {
      label: 'Visible',
      color: 'text-[var(--zenith-success)]',
      bg: 'bg-[var(--zenith-success)]/10',
    },
    daylight: {
      label: 'Daylight',
      color: 'text-[var(--zenith-warning)]',
      bg: 'bg-[var(--zenith-warning)]/10',
    },
    eclipsed: {
      label: 'Eclipsed',
      color: 'text-[var(--zenith-text-muted)]',
      bg: 'bg-[var(--zenith-surface-elevated)]',
    },
  }
  return configs[props.position.visibility]
})
</script>

<template>
  <BaseCard title="International Space Station" subtitle="Live tracking data" hoverable>
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <span
          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
          :class="[visibilityConfig.color, visibilityConfig.bg]"
        >
          <span
            class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
            :class="position.visibility === 'visible' ? 'bg-[var(--zenith-success)] animate-pulse-glow' : 'bg-current'"
          />
          {{ visibilityConfig.label }}
        </span>
        <BaseButton
          variant="ghost"
          size="sm"
          :loading="props.loading"
          @click="emit('refresh')"
        >
          Refresh
        </BaseButton>
      </div>

      <p v-if="props.error" class="rounded-[1.1rem] border border-[var(--zenith-warning)]/30 bg-[var(--zenith-warning)]/10 p-3 text-sm text-[var(--zenith-warning)]">
        {{ props.error }}
      </p>

      <div v-else class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Latitude</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">
            {{ formatCoordinate(position.latitude, 'lat') }}
          </p>
        </div>
        <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Longitude</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">
            {{ formatCoordinate(position.longitude, 'lng') }}
          </p>
        </div>
        <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Altitude</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">
            {{ formatAltitude(position.altitude * 1000) }}
          </p>
        </div>
        <div class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-3">
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Velocity</p>
          <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">
            {{ formatVelocity(position.velocity) }}
          </p>
        </div>
      </div>

      <div class="rounded-[1.1rem] border border-white/10 bg-gradient-to-r from-[var(--zenith-accent)]/10 to-sky-500/10 p-3">
        <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Telemetry update</p>
        <p class="mt-1 text-sm text-[var(--zenith-text)]">Last updated: {{ formatDateTime(position.timestamp) }}</p>
      </div>
    </div>
  </BaseCard>
</template>
