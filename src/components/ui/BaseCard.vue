<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hoverable: false,
})

const paddingClasses = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}
</script>

<template>
  <div
    class="group relative isolate overflow-hidden rounded-[1.6rem] border border-white/20 bg-white/10 shadow-[0_20px_70px_rgba(3,7,18,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out"
    :class="[
      paddingClasses[props.padding],
      { 'hover:-translate-y-1.5 hover:scale-[1.005] hover:border-[var(--zenith-accent)]/50 hover:shadow-[0_28px_90px_rgba(124,92,255,0.2)]': props.hoverable },
    ]"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    <div class="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.16),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div class="relative">
      <div v-if="props.title || $slots.header" class="mb-5">
        <slot name="header">
          <div>
            <h3 v-if="props.title" class="text-base font-semibold tracking-[0.01em] text-[var(--zenith-text)]">
              {{ props.title }}
            </h3>
            <p v-if="props.subtitle" class="mt-1.5 text-sm leading-6 text-[var(--zenith-text-muted)]">
              {{ props.subtitle }}
            </p>
          </div>
        </slot>
      </div>
      <slot />
      <div v-if="$slots.footer" class="mt-5 border-t border-[var(--zenith-border-subtle)] pt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
