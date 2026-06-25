<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const appName = import.meta.env.VITE_APP_NAME

const features = [
  {
    title: 'Sky Radar',
    description: 'Real-time celestial object tracking with azimuth and altitude plotting.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: 'ISS Tracker',
    description: 'Monitor the International Space Station position, velocity, and visibility.',
    icon: 'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
  },
  {
    title: 'Saved Locations',
    description: 'Store and manage your favorite observation sites around the world.',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  },
]

const stats = [
  { value: '120+', label: 'Satellites tracked', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { value: '24/7', label: 'ISS updates', icon: 'M12 8v4l3 3' },
  { value: '4.9K', label: 'Solar data points', icon: 'M12 3v2m0 14v2m9-9h-2M5 12H3m12.657 7.657l-1.414-1.414M8.757 8.757L7.343 7.343m7.314 0l-1.414 1.414M8.757 15.243l-1.414 1.414' },
  { value: '48', label: 'Observation locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
]

const reasons = [
  {
    title: 'Real-Time Tracking',
    description: 'Follow celestial motion with fluid, live telemetry and responsive visualization.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Observation Planning',
    description: 'Map your ideal viewing windows and save premium observation sites in seconds.',
    icon: 'M8 7h8M8 12h8m-8 5h5',
  },
  {
    title: 'Live Astronomy Data',
    description: 'Blend weather, moon phase, ISS status, and solar timing into one elegant view.',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
  {
    title: 'Beautiful Visualization',
    description: 'Enjoy a cinematic interface designed to feel as thoughtful as the night sky itself.',
    icon: 'M4 8h16M7 4v16m10-16v16',
  },
]
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-8 lg:gap-10">
    <section class="relative isolate overflow-hidden rounded-[2.2rem] border border-white/20 bg-[var(--zenith-surface)]/70 px-6 py-10 shadow-[0_30px_90px_rgba(3,7,18,0.28)] backdrop-blur-2xl sm:px-8 sm:py-14 lg:min-h-[78vh] lg:px-12 lg:py-16">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.26),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.16),transparent_28%)]" />
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%,rgba(255,255,255,0.06))]" />
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0,transparent_60%)] opacity-70" />
      <div class="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--zenith-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <span class="h-2.5 w-2.5 animate-pulse-glow rounded-full bg-[var(--zenith-accent)]" />
            Premium astronomy command center
          </div>

          <h1 class="mt-5 text-4xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-5xl lg:text-7xl">
            See the sky like never before.
          </h1>

          <p class="mt-5 max-w-2xl text-base leading-8 text-[var(--zenith-text-muted)] sm:text-lg">
            {{ appName }} brings real-time ISS tracking, live celestial data, and observation planning into one refined experience for curious minds and serious skywatchers.
          </p>

          <div class="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <RouterLink to="/register">
              <BaseButton size="lg" class="group shadow-[0_16px_40px_rgba(124,92,255,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(124,92,255,0.32)]">
                Launch your observatory
              </BaseButton>
            </RouterLink>
            <RouterLink to="/login">
              <BaseButton variant="secondary" size="lg" class="group border-white/15 bg-white/10 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[var(--zenith-accent)]/40 hover:bg-white/15">
                Explore the platform
              </BaseButton>
            </RouterLink>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--zenith-text-muted)]">
            <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">Realtime orbital insights</span>
            <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">Live sky conditions</span>
            <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">Observation-ready planning</span>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-[1.8rem] border border-white/15 bg-[var(--zenith-surface-elevated)]/80 p-4 shadow-[0_24px_80px_rgba(3,7,18,0.24)] backdrop-blur-xl sm:p-6">
            <div class="rounded-[1.35rem] border border-white/10 bg-[var(--zenith-surface)]/90 p-4 sm:p-5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--zenith-text-subtle)]">Observatory status</p>
                  <p class="mt-1 text-lg font-semibold text-[var(--zenith-text)]">Live sky feed online</p>
                </div>
                <div class="rounded-full bg-[var(--zenith-accent-muted)] px-3 py-1 text-sm font-medium text-[var(--zenith-accent)]">
                  Active
                </div>
              </div>

              <div class="mt-5 space-y-3">
                <div class="rounded-[1.1rem] border border-white/10 bg-white/10 p-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-[var(--zenith-text-muted)]">ISS visibility</span>
                    <span class="font-semibold text-[var(--zenith-text)]">Excellent</span>
                  </div>
                  <div class="mt-2 h-2 rounded-full bg-[var(--zenith-surface-elevated)]">
                    <div class="h-2 w-4/5 rounded-full bg-gradient-to-r from-[var(--zenith-accent)] to-sky-500" />
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-[1.1rem] border border-white/10 bg-white/10 p-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Moon phase</p>
                    <p class="mt-1 font-semibold text-[var(--zenith-text)]">Waxing Gibbous</p>
                  </div>
                  <div class="rounded-[1.1rem] border border-white/10 bg-white/10 p-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Weather</p>
                    <p class="mt-1 font-semibold text-[var(--zenith-text)]">Clear skies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <BaseCard
        v-for="feature in features"
        :key="feature.title"
        :title="feature.title"
        :subtitle="feature.description"
        hoverable
        class="group"
      >
        <div class="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_28px_rgba(124,92,255,0.16)]">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.icon" />
          </svg>
        </div>
      </BaseCard>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-[1.4rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_16px_50px_rgba(3,7,18,0.16)] backdrop-blur-xl"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 text-white shadow-[0_12px_24px_rgba(124,92,255,0.22)]">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="stat.icon" />
          </svg>
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ stat.value }}</p>
        <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ stat.label }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-[2rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-7 shadow-[0_24px_70px_rgba(3,7,18,0.2)] backdrop-blur-xl sm:p-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--zenith-text-muted)]">
          Why Project Zenith
        </div>
        <h2 class="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)] sm:text-4xl">
          Crafted for modern skywatchers.
        </h2>
        <p class="mt-4 text-base leading-8 text-[var(--zenith-text-muted)]">
          A cinematic observatory experience designed to feel effortless, informative, and beautifully alive from the first glance.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <BaseCard
          v-for="item in reasons"
          :key="item.title"
          :title="item.title"
          :subtitle="item.description"
          hoverable
          class="group h-full"
        >
          <div class="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_28px_rgba(124,92,255,0.16)]">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
            </svg>
          </div>
        </BaseCard>
      </div>
    </section>

    <section class="rounded-[2rem] border border-white/15 bg-[var(--zenith-surface)]/70 px-6 py-8 text-center shadow-[0_24px_70px_rgba(3,7,18,0.18)] backdrop-blur-xl sm:px-8 sm:py-10">
      <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)] sm:text-3xl">
        Ready to explore the cosmos?
      </h2>
      <p class="mx-auto mt-3 max-w-2xl text-base leading-8 text-[var(--zenith-text-muted)]">
        Create a free account and start tracking celestial objects tonight with a premium, immersive workflow.
      </p>
      <RouterLink to="/register" class="mt-6 inline-block">
        <BaseButton size="lg" class="shadow-[0_16px_40px_rgba(124,92,255,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(124,92,255,0.32)]">
          Create Free Account
        </BaseButton>
      </RouterLink>
    </section>
  </div>
</template>
