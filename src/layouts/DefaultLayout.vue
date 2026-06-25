<script setup lang="ts">
import { computed } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppMobileNav from '@/components/layout/AppMobileNav.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const authStore = useAuthStore()
const uiStore = useUiStore()

const sidebarOffsetClass = computed(() => {
  if (!authStore.isAuthenticated) return ''
  return uiStore.sidebarOpen ? 'lg:pl-[18rem]' : 'lg:pl-[5.4rem]'
})
</script>

<template>
  <div class="relative flex h-screen overflow-hidden bg-transparent">
    <AppSidebar v-if="authStore.isAuthenticated" />

    <div
      class="flex h-screen flex-1 flex-col"
      :class="authStore.isAuthenticated ? sidebarOffsetClass : ''"
    >
      <AppNavbar />

      <main class="relative z-10 flex-1 overflow-y-auto px-3 py-3 pb-28 sm:px-4 md:px-5 lg:px-6 lg:py-6 lg:pb-8">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div class="animate-[fade-up_0.35s_ease-out]">
            <slot />
          </div>
        </div>
      </main>

      <AppMobileNav v-if="authStore.isAuthenticated" />
    </div>
  </div>
</template>
