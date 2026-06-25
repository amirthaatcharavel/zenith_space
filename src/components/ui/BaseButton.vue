<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--zenith-accent)] to-sky-500 text-white shadow-lg shadow-[var(--zenith-accent-muted)] hover:translate-y-[-1px] hover:shadow-xl',
  secondary:
    'bg-[var(--zenith-surface-elevated)]/80 text-[var(--zenith-text)] border border-[var(--zenith-border)] hover:border-[var(--zenith-accent)] hover:text-[var(--zenith-accent)] backdrop-blur',
  ghost:
    'bg-transparent text-[var(--zenith-text-muted)] hover:bg-[var(--zenith-surface-elevated)] hover:text-[var(--zenith-text)]',
  danger:
    'bg-[var(--zenith-danger)] text-white hover:opacity-90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    class="group inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zenith-accent)]/60 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] hover:-translate-y-0.5"
    :class="[variantClasses[props.variant], sizeClasses[props.size], { 'w-full': props.block }]"
  >
    <svg
      v-if="props.loading"
      class="h-4 w-4 animate-spin-slow"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
