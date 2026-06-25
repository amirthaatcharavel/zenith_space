<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Radar', to: '/radar', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'ISS', to: '/iss', icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z' },
  { label: 'Places', to: '/locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { label: 'Planner', to: '/planner', icon: 'M21 13.255A8.996 8.996 0 0112 21c-4.97 0-9-4.03-9-9 0-3.8 2.1-7.1 5.3-8.76' },
  { label: 'Calendar', to: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Profile', to: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="fixed bottom-3 left-3 right-3 z-30 rounded-[1.4rem] border border-white/15 bg-[var(--zenith-surface)]/80 p-2 shadow-[0_20px_55px_rgba(3,7,18,0.24)] backdrop-blur-2xl lg:hidden">
    <ul class="flex items-center justify-around gap-1">
      <li v-for="item in navItems" :key="item.to" class="flex-1">
        <RouterLink
          :to="item.to"
          class="flex flex-col items-center gap-0.5 rounded-[1rem] px-2 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:scale-[1.01]"
          :class="
            isActive(item.to)
              ? 'bg-gradient-to-r from-[var(--zenith-accent)]/16 to-sky-400/12 text-[var(--zenith-accent)] shadow-[0_8px_20px_rgba(124,92,255,0.12)]'
              : 'text-[var(--zenith-text-subtle)] hover:bg-white/10 hover:text-[var(--zenith-text)]'
          "
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
          </svg>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
