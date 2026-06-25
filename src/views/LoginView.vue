<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login, loading, error, clearError } = useAuth()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

function validate(): boolean {
  emailError.value = ''
  passwordError.value = ''
  clearError()

  let valid = true

  if (!email.value.trim()) {
    emailError.value = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Enter a valid email address'
    valid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    valid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    valid = false
  }

  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return

  try {
    await login({ email: email.value, password: password.value })
    const redirect = route.query.redirect as string | undefined
    await router.push(redirect ?? '/dashboard')
  } catch {
    // Error handled by store
  }
}
</script>

<template>
  <BaseCard title="Welcome Back" subtitle="Sign in to your Zenith account">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="observer@zenith.app"
        :error="emailError"
        required
      />
      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        :error="passwordError"
        required
      />

      <p v-if="error" class="rounded-lg bg-[var(--zenith-danger)]/10 px-4 py-3 text-sm text-[var(--zenith-danger)]">
        {{ error }}
      </p>

      <BaseButton type="submit" block :loading="loading">
        Sign In
      </BaseButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-[var(--zenith-text-muted)]">
        Don't have an account?
        <RouterLink to="/register" class="font-medium text-[var(--zenith-accent)] hover:underline">
          Create one
        </RouterLink>
      </p>
    </template>
  </BaseCard>
</template>
