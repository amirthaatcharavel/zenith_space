<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function close(): void {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          @click="close"
        />
        <Transition
          enter-active-class="transition-all duration-250 ease-out"
          leave-active-class="transition-all duration-180 ease-in"
          enter-from-class="opacity-0 scale-[0.96] translate-y-2"
          leave-to-class="opacity-0 scale-[0.97] translate-y-1"
        >
          <div
            v-if="props.modelValue"
            class="relative w-full rounded-[1.8rem] border border-white/20 bg-[var(--zenith-surface)]/90 shadow-[0_30px_80px_rgba(3,7,18,0.46)] backdrop-blur-2xl"
            :class="sizeClasses[props.size]"
          >
            <div
              v-if="props.title || $slots.header"
              class="flex items-center justify-between border-b border-[var(--zenith-border-subtle)] px-6 py-4"
            >
              <slot name="header">
                <h2 class="text-lg font-semibold text-[var(--zenith-text)]">
                  {{ props.title }}
                </h2>
              </slot>
              <button
                type="button"
                class="rounded-lg p-1.5 text-[var(--zenith-text-muted)] transition-colors hover:bg-[var(--zenith-surface-elevated)] hover:text-[var(--zenith-text)]"
                aria-label="Close modal"
                @click="close"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-6 py-5">
              <slot />
            </div>
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 border-t border-[var(--zenith-border-subtle)] px-6 py-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
