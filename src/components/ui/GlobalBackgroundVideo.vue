<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUiStore } from '@/stores/ui.store'

const uiStore = useUiStore()
const theme = computed(() => uiStore.theme)
const isDarkTheme = computed(() => theme.value === 'dark')

const videoElements = [ref<HTMLVideoElement | null>(null), ref<HTMLVideoElement | null>(null)]
const activeIndex = ref(0)
const isTransitioning = ref(false)
const prefersReducedMotion = ref(false)
const posterImage = ref<string | null>(null)

let mediaQuery: MediaQueryList | null = null
let transitionCounter = 0

const overlayStyle = computed(() => ({
  background: isDarkTheme.value
    ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.64) 0%, rgba(2, 6, 23, 0.36) 48%, rgba(2, 6, 23, 0.72) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0.3) 100%)',
}))

function setVideoRef(element: HTMLVideoElement | null, index: number): void {
  videoElements[index].value = element
}

function pauseVideos(): void {
  videoElements.forEach((refValue) => {
    refValue.value?.pause()
  })
}

function getVideoSource(themeMode: 'dark' | 'light'): string {
  return themeMode === 'dark' ? '/videos/dark-space.mp4' : '/videos/light-earth.mp4'
}

function createStaticPoster(source: string): void {
  const video = document.createElement('video')
  video.src = source
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'

  const handleReady = () => {
    const canvas = document.createElement('canvas')
    const width = 1280
    const height = 720
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(video, 0, 0, width, height)
      posterImage.value = canvas.toDataURL('image/jpeg', 0.9)
    }

    video.remove()
  }

  video.addEventListener('loadeddata', handleReady, { once: true })
  video.addEventListener('error', () => video.remove(), { once: true })

  void video.play().catch(() => {
    handleReady()
  })
}

function switchToTheme(themeMode: 'dark' | 'light'): void {
  const source = getVideoSource(themeMode)

  if (prefersReducedMotion.value) {
    pauseVideos()
    createStaticPoster(source)
    return
  }

  const nextIndex = activeIndex.value === 0 ? 1 : 0
  const enteringElement = videoElements[nextIndex].value
  const leavingElement = videoElements[activeIndex.value].value

  if (!enteringElement || !leavingElement) {
    posterImage.value = null
    return
  }

  isTransitioning.value = true
  posterImage.value = null

  enteringElement.src = source
  enteringElement.currentTime = 0
  enteringElement.load()
  enteringElement.style.opacity = '0'

  const transitionId = ++transitionCounter

  const finishTransition = () => {
    if (transitionId !== transitionCounter) return
    enteringElement.style.opacity = '1'
    leavingElement.style.opacity = '0'
    activeIndex.value = nextIndex
    window.setTimeout(() => {
      if (transitionId !== transitionCounter) return
      isTransitioning.value = false
    }, 500)
  }

  enteringElement.addEventListener('loadeddata', finishTransition, { once: true })
  void enteringElement.play().catch(() => {
    finishTransition()
  })
}

function handleReducedMotionChange(event: MediaQueryListEvent | MediaQueryList): void {
  prefersReducedMotion.value = event.matches
}

watch(theme, (mode) => {
  switchToTheme(mode as 'dark' | 'light')
}, { flush: 'post' })

watch(prefersReducedMotion, (enabled) => {
  if (enabled) {
    pauseVideos()
    createStaticPoster(getVideoSource(isDarkTheme.value ? 'dark' : 'light'))
  } else {
    switchToTheme(isDarkTheme.value ? 'dark' : 'light')
  }
})

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  mediaQuery.addEventListener('change', handleReducedMotionChange)
  switchToTheme(isDarkTheme.value ? 'dark' : 'light')
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', handleReducedMotionChange)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div
      v-if="prefersReducedMotion && posterImage"
      class="absolute inset-0 h-full w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${posterImage})` }"
    />

    <template v-else>
      <video
        v-for="(_, index) in videoElements"
        :key="index"
        :ref="(element) => setVideoRef(element as HTMLVideoElement | null, index)"
        class="absolute inset-0 h-full w-full min-h-full min-w-full object-cover transition-opacity duration-500 ease-out"
        :class="index === activeIndex ? 'opacity-100' : 'opacity-0'"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
      />
    </template>

    <div class="absolute inset-0 transition-colors duration-500 ease-out" :style="overlayStyle" />
  </div>
</template>
