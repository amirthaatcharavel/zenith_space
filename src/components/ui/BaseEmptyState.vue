<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 px-6 py-14 text-center shadow-[0_20px_70px_rgba(3,7,18,0.2)] backdrop-blur-2xl transition-all duration-300 animate-[fade-up_0.35s_ease-out]">
    <div
      class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/80 to-sky-500/70 text-white shadow-[0_12px_30px_rgba(124,92,255,0.25)]"
    >
      <slot name="icon">
        <svg
          class="h-8 w-8 text-[var(--zenith-accent)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </slot>
    </div>
    <h3 class="text-lg font-semibold text-[var(--zenith-text)]">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-[var(--zenith-text-muted)]">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
