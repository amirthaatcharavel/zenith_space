<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <div
      class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--zenith-accent-muted)]"
    >
      <span class="text-4xl font-bold text-[var(--zenith-accent)]">404</span>
    </div>
    <h1 class="text-2xl font-bold text-[var(--zenith-text)]">
      Page Not Found
    </h1>
    <p class="mt-2 max-w-md text-[var(--zenith-text-muted)]">
      The celestial object you're looking for seems to have drifted out of view.
      The page may have moved or no longer exists.
    </p>
    <div class="mt-8 flex gap-4">
      <RouterLink to="/">
        <BaseButton variant="secondary">
          Go Home
        </BaseButton>
      </RouterLink>
      <RouterLink to="/dashboard">
        <BaseButton>
          Dashboard
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
