<script setup lang="ts">
import { computed } from 'vue'
import { formatPassTime } from '@/utils/helpers'

interface PassPrediction {
  time: string
  duration: number
  maxElevation: number
}

interface Props {
  prediction: PassPrediction | null
  schedule: PassPrediction[]
  visibilityQuality: {
    label: string
    score: number
    description: string
  }
}

const props = defineProps<Props>()

const countdownText = computed(() => {
  if (!props.prediction) {
    return 'Awaiting next rise window'
  }

  const difference = new Date(props.prediction.time).getTime() - Date.now()
  if (difference <= 0) {
    return 'In progress'
  }

  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m until the next pass`
})
</script>

<template>
  <div class="rounded-[1.4rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-5 shadow-[0_18px_44px_rgba(3,7,18,0.16)] backdrop-blur-xl">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-[var(--zenith-text)]">Next pass</h3>
        <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">Forecasted visibility for your active location</p>
      </div>
      <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--zenith-text-subtle)]">
        {{ prediction ? 'Available' : 'Pending' }}
      </span>
    </div>

    <div class="mt-5 rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-[var(--zenith-accent)]/12 to-sky-500/10 p-4">
      <div v-if="prediction" class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Upcoming window</p>
            <p class="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ formatPassTime(prediction.time) }}</p>
          </div>
          <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
            {{ countdownText }}
          </span>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-[1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Duration</p>
            <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ prediction.duration }}s</p>
          </div>
          <div class="rounded-[1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Max elevation</p>
            <p class="mt-1 font-mono text-sm text-[var(--zenith-text)]">{{ prediction.maxElevation }}°</p>
          </div>
          <div class="rounded-[1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Visibility</p>
            <p class="mt-1 text-sm font-medium text-[var(--zenith-text)]">{{ visibilityQuality.label }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-sm text-[var(--zenith-text-muted)]">
        The pass forecast is still being prepared for your current point of observation.
      </div>
    </div>

    <div class="mt-5 rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Visibility quality</p>
        <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
          {{ visibilityQuality.label }} · {{ visibilityQuality.score }}/100
        </span>
      </div>
      <p class="mt-2 text-sm leading-6 text-[var(--zenith-text-muted)]">{{ visibilityQuality.description }}</p>
    </div>

    <div class="mt-5">
      <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">7-day pass schedule</p>
      <div class="mt-3 space-y-2">
        <div
          v-for="(item, index) in schedule"
          :key="item.time"
          class="flex items-center justify-between rounded-[1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/70 px-3 py-2 text-sm text-[var(--zenith-text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/8"
          :class="index % 2 === 1 ? 'bg-white/5' : ''"
        >
          <span class="text-[var(--zenith-text)]">{{ formatPassTime(item.time) }}</span>
          <span>{{ item.duration }}s · {{ item.maxElevation }}°</span>
        </div>
      </div>
    </div>
  </div>
</template>
