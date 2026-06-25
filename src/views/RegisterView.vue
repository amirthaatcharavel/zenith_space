<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, loading, error, clearError } = useAuth()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')

function validate(): boolean {
  usernameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmError.value = ''
  clearError()

  let valid = true

  if (!username.value.trim()) {
    usernameError.value = 'Username is required'
    valid = false
  } else if (username.value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
    valid = false
  }

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

  if (password.value !== confirmPassword.value) {
    confirmError.value = 'Passwords do not match'
    valid = false
  }

  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return

  try {
    await register({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    await router.push('/dashboard')
  } catch {
    // Error handled by store
  }
}
</script>

<template>
  <BaseCard title="Create Account" subtitle="Join Project Zenith today">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="username"
        label="Username"
        placeholder="StellarObserver"
        :error="usernameError"
        required
      />
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="emailError"
        required
      />
      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        :error="passwordError"
        required
      />
      <BaseInput
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        :error="confirmError"
        required
      />

      <p v-if="error" class="rounded-lg bg-[var(--zenith-danger)]/10 px-4 py-3 text-sm text-[var(--zenith-danger)]">
        {{ error }}
      </p>

      <BaseButton type="submit" block :loading="loading">
        Create Account
      </BaseButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-[var(--zenith-text-muted)]">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-[var(--zenith-accent)] hover:underline">
          Sign in
        </RouterLink>
      </p>
    </template>
  </BaseCard>
</template>
