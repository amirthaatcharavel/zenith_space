<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import GlobalBackgroundVideo from '@/components/ui/GlobalBackgroundVideo.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta.layout as string | undefined
  return layoutName === 'auth' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[var(--zenith-bg)] transition-colors duration-500">
    <GlobalBackgroundVideo />
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_24%)] transition-opacity duration-500" />

    <div class="relative z-10 flex min-h-screen flex-col">
      <component :is="layout">
        <RouterView v-slot="{ Component }">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-2 scale-[0.99]"
            leave-to-class="opacity-0 translate-y-1 scale-[0.995]"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </component>
    </div>
  </div>
</template>
