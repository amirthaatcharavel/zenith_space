<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Loading',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3"
    role="status"
    :aria-label="props.label"
  >
    <div class="w-full max-w-md space-y-3 rounded-[1.4rem] border border-white/10 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_16px_44px_rgba(3,7,18,0.12)] backdrop-blur-xl">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 animate-pulse rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/25 to-sky-500/20" />
        <div class="flex-1 space-y-2">
          <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div class="h-3 w-40 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-3 w-full animate-pulse rounded-full bg-white/10" />
        <div class="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
        <div class="h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
      </div>
    </div>
    <p v-if="props.label" class="text-sm text-[var(--zenith-text-muted)]">
      {{ props.label }}
    </p>
  </div>
</template>
