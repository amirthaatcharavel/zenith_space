<script setup lang="ts">
import type { VisibleObject } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatMagnitude } from '@/utils/helpers'

interface Props {
  object: VisibleObject
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const typeIcons: Record<string, string> = {
  planet: 'M12 2a10 10 0 100 20 10 10 0 000-20z',
  star: 'M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z',
  moon: 'M20 14a8 8 0 11-8-8 8 8 0 008 8z',
  galaxy: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  nebula: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  comet: 'M12 2l-1 8h2l-1-8z',
  satellite: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
}
</script>

<template>
  <BaseCard :hoverable="!props.compact" :padding="props.compact ? 'sm' : 'md'">
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)] shadow-[0_12px_24px_rgba(124,92,255,0.16)]">
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path :d="typeIcons[object.type] ?? typeIcons.planet" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <h4 class="truncate font-semibold text-[var(--zenith-text)]">
            {{ object.name }}
          </h4>
          <span
            v-if="object.magnitude !== undefined"
            class="shrink-0 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--zenith-text-muted)]"
          >
            mag {{ formatMagnitude(object.magnitude) }}
          </span>
        </div>
        <p class="mt-0.5 text-xs capitalize text-[var(--zenith-text-subtle)]">
          {{ object.type }}
        </p>
        <div v-if="!props.compact" class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div class="rounded-xl border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-2">
            <span class="block text-[var(--zenith-text-subtle)]">Altitude</span>
            <span class="mt-1 block font-mono text-[var(--zenith-text)]">{{ object.altitude }}°</span>
          </div>
          <div class="rounded-xl border border-white/10 bg-[var(--zenith-surface-elevated)]/70 p-2">
            <span class="block text-[var(--zenith-text-subtle)]">Azimuth</span>
            <span class="mt-1 block font-mono text-[var(--zenith-text)]">{{ object.azimuth }}°</span>
          </div>
        </div>
        <p
          v-if="object.description && !props.compact"
          class="mt-3 line-clamp-2 text-sm text-[var(--zenith-text-muted)]"
        >
          {{ object.description }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>
