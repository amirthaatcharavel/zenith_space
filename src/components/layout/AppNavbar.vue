<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { useUiStore } from '@/stores/ui.store'
import { getInitials } from '@/utils/helpers'

const { user, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()
const uiStore = useUiStore()
const router = useRouter()

const appName = import.meta.env.VITE_APP_NAME

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent): void {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout(): void {
  userMenuOpen.value = false
  logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-3 z-30 mx-3 mt-3 flex h-16 items-center gap-3 rounded-[1.35rem] border border-white/20 bg-[var(--zenith-surface)]/70 px-3 shadow-[0_20px_60px_rgba(3,7,18,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out sm:h-[4.25rem] lg:mx-4 lg:h-[5rem] lg:px-5">
    <button
      type="button"
      class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[var(--zenith-text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--zenith-accent)]/40 hover:bg-white/15 hover:text-[var(--zenith-text)] lg:hidden"
      aria-label="Toggle sidebar"
      @click="uiStore.toggleSidebar()"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 shadow-[0_12px_24px_rgba(124,92,255,0.24)]">
        <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <div class="hidden sm:block">
        <p class="text-sm font-semibold tracking-[0.01em] text-[var(--zenith-text)]">{{ appName }}</p>
        <p class="text-xs text-[var(--zenith-text-subtle)]">Mission control</p>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <div class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-[var(--zenith-text-muted)] lg:flex">
        <span class="h-2.5 w-2.5 animate-pulse-glow rounded-full bg-[var(--zenith-accent)]" />
        Live observatory feed
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[var(--zenith-text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[var(--zenith-accent)]/40 hover:bg-white/15 hover:text-[var(--zenith-text)] active:scale-[0.97]"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <div v-if="user" ref="userMenuRef" class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-2 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[var(--zenith-accent)]/40 hover:bg-white/15 active:scale-[0.98]"
          aria-label="User menu"
          @click.stop="userMenuOpen = !userMenuOpen"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 text-xs font-semibold text-white">
            {{ getInitials(user.username) }}
          </div>
          <span class="hidden text-sm font-medium text-[var(--zenith-text)] md:block">
            {{ user.username }}
          </span>
          <svg class="hidden h-4 w-4 text-[var(--zenith-text-muted)] md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-150"
          leave-active-class="transition-all duration-100"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="userMenuOpen"
            class="absolute right-0 top-full mt-2 w-52 rounded-[1.2rem] border border-white/15 bg-[var(--zenith-surface)]/90 p-1.5 shadow-[0_20px_60px_rgba(3,7,18,0.26)] backdrop-blur-2xl"
          >
            <RouterLink
              to="/profile"
              class="flex items-center gap-2 rounded-[0.9rem] px-3 py-2.5 text-sm text-[var(--zenith-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--zenith-text)]"
              @click="userMenuOpen = false"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </RouterLink>
            <button
              type="button"
              class="mt-1 flex w-full items-center gap-2 rounded-[0.9rem] px-3 py-2.5 text-sm text-[var(--zenith-danger)] transition-colors hover:bg-white/10"
              @click="handleLogout"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </Transition>
      </div>

      <RouterLink
        v-else
        to="/login"
        class="rounded-2xl bg-gradient-to-r from-[var(--zenith-accent)] to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(124,92,255,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_16px_30px_rgba(124,92,255,0.3)] active:scale-[0.97]"
      >
        Sign In
      </RouterLink>
    </div>
  </header>
</template>
