<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="props.label"
      :for="inputId"
      class="text-sm font-medium text-[var(--zenith-text-muted)]"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-[var(--zenith-accent)]">*</span>
    </label>
    <input
      :id="inputId"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      class="w-full rounded-xl border bg-[var(--zenith-surface-elevated)]/80 px-4 py-2.5 text-sm text-[var(--zenith-text)] placeholder:text-[var(--zenith-text-subtle)] shadow-inner shadow-black/10 transition-all duration-300 ease-out focus:outline-none focus:-translate-y-0.5 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        props.error
          ? 'border-[var(--zenith-danger)] focus:border-[var(--zenith-danger)]'
          : 'border-[var(--zenith-border)] focus:border-[var(--zenith-accent)]'
      "
      @input="onInput"
    />
    <p v-if="props.error" class="text-xs text-[var(--zenith-danger)]">
      {{ props.error }}
    </p>
    <p v-else-if="props.hint" class="text-xs text-[var(--zenith-text-subtle)]">
      {{ props.hint }}
    </p>
  </div>
</template>
