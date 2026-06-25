import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'dark' | 'light'

const THEME_STORAGE_KEY = 'zenith_theme'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const mobileNavOpen = ref(false)
  const theme = ref<ThemeMode>('dark')

  function initializeTheme(): void {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored === 'dark' || stored === 'light') {
      theme.value = stored
    }
    applyTheme(theme.value)
  }

  function applyTheme(mode: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', mode)
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebarOpen(open: boolean): void {
    sidebarOpen.value = open
  }

  function toggleMobileNav(): void {
    mobileNavOpen.value = !mobileNavOpen.value
  }

  function setMobileNavOpen(open: boolean): void {
    mobileNavOpen.value = open
  }

  watch(theme, (mode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    applyTheme(mode)
  })

  return {
    sidebarOpen,
    mobileNavOpen,
    theme,
    initializeTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarOpen,
    toggleMobileNav,
    setMobileNavOpen,
  }
})
