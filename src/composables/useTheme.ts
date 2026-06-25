import { computed } from 'vue'
import { useUiStore } from '@/stores/ui.store'

export function useTheme() {
  const uiStore = useUiStore()

  const theme = computed(() => uiStore.theme)
  const isDark = computed(() => uiStore.theme === 'dark')

  return {
    theme,
    isDark,
    toggleTheme: uiStore.toggleTheme,
  }
}
