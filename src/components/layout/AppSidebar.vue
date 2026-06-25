<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import type { NavItem } from '@/types'

const route = useRoute()
const uiStore = useUiStore()

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Sky Radar',
    to: '/radar',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    label: 'ISS Tracker',
    to: '/iss',
    icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
  },
  {
    label: 'Locations',
    to: '/locations',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Planner',
    to: '/planner',
    icon: 'M21 13.255A8.996 8.996 0 0112 21c-4.97 0-9-4.03-9-9 0-3.8 2.1-7.1 5.3-8.76',
  },
  {
    label: 'Calendar',
    to: '/calendar',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

const isActive = (path: string): boolean => route.path === path

const sidebarClasses = computed(() => [
  'fixed top-0 bottom-0 left-3 z-40 flex flex-col rounded-[1.6rem] border border-white/20 bg-[var(--zenith-surface)]/70 p-3 shadow-[0_30px_80px_rgba(3,7,18,0.28)] backdrop-blur-2xl transition-all duration-300 h-screen',
  uiStore.sidebarOpen ? 'w-[18rem] translate-x-0' : '-translate-x-full w-[18rem] lg:w-[5.4rem] lg:translate-x-0',
])
</script>

<template>
  <aside :class="sidebarClasses">
    <div class="flex items-center justify-between rounded-[1.2rem] border border-white/15 bg-white/10 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300">
      <div class="flex min-w-0 items-center gap-3">
        <div class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 shadow-[0_14px_30px_rgba(124,92,255,0.28)]">
          <div class="absolute inset-0 rounded-[1rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_70%)]" />
          <svg class="relative h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div class="min-w-0" :class="uiStore.sidebarOpen ? 'opacity-100' : 'hidden lg:opacity-0'">
          <p class="text-sm font-semibold tracking-[0.01em] text-[var(--zenith-text)]">Zenith</p>
          <p class="truncate text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">The Celestial Eye</p>
        </div>
      </div>

      <button
        type="button"
        class="hidden rounded-2xl border border-white/10 bg-white/10 p-2 text-[var(--zenith-text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[var(--zenith-accent)]/40 hover:bg-white/15 hover:text-[var(--zenith-text)] active:scale-[0.97] lg:inline-flex"
        :aria-label="uiStore.sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="uiStore.toggleSidebar()"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <nav class="mt-4 flex-1 overflow-y-auto px-1 py-2">
      <div class="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]" :class="uiStore.sidebarOpen ? 'opacity-100' : 'hidden lg:opacity-0'">
        Workspace
      </div>
      <ul class="space-y-1.5">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="group relative flex items-center gap-3 rounded-[1rem] px-3 py-2.75 text-sm font-medium transition-all duration-250"
            :class="
              isActive(item.to)
                ? 'bg-gradient-to-r from-[var(--zenith-accent)]/16 via-[var(--zenith-accent)]/10 to-sky-400/12 text-[var(--zenith-text)] shadow-[0_12px_30px_rgba(124,92,255,0.16)] ring-1 ring-white/10'
                : 'text-[var(--zenith-text-muted)] hover:-translate-y-0.5 hover:bg-white/10 hover:text-[var(--zenith-text)]'
            "
            @click="uiStore.setSidebarOpen(false)"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-250"
              :class="isActive(item.to) ? 'bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 text-white shadow-[0_10px_24px_rgba(124,92,255,0.22)]' : 'group-hover:bg-[var(--zenith-accent-muted)] group-hover:text-[var(--zenith-accent)]'"
            >
              <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
              </svg>
            </span>
            <span class="truncate" :class="uiStore.sidebarOpen ? 'opacity-100' : 'hidden lg:opacity-0'">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="rounded-[1.2rem] border border-white/15 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-400/20 text-[var(--zenith-accent)]">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v18m14-14l-8 8-4-4" />
          </svg>
        </div>
        <div class="min-w-0" :class="uiStore.sidebarOpen ? 'opacity-100' : 'hidden lg:opacity-0'">
          <p class="text-sm font-medium text-[var(--zenith-text)]">Observatory ready</p>
          <p class="truncate text-xs text-[var(--zenith-text-muted)]">Live sky data synced</p>
        </div>
      </div>
    </div>
  </aside>

  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="uiStore.sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="uiStore.setSidebarOpen(false)"
    />
  </Transition>
</template>
