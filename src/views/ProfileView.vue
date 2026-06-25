<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { getInitials, formatDateTime } from '@/utils/helpers'

const { user, logout } = useAuth()
const { theme, toggleTheme } = useTheme()
const router = useRouter()

const username = ref(user.value?.username ?? '')
const email = ref(user.value?.email ?? '')
const saved = ref(false)

const accountOverview = computed(() => [
  {
    label: 'Saved locations',
    value: '12',
    detail: 'Ready for observation',
    icon: 'M12 21l-7-4V5l7-4 7 4v12l-7 4z',
    accent: 'from-cyan-500/20 to-sky-500/20',
    iconColor: 'text-cyan-300',
  },
  {
    label: 'Observation sessions',
    value: '8',
    detail: 'Tracked this month',
    icon: 'M5 19V9m7 10V5m7 14v-7',
    accent: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-300',
  },
  {
    label: 'Favorite objects',
    value: '4',
    detail: 'Curated celestial picks',
    icon: 'M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3z',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-300',
  },
  {
    label: 'Account status',
    value: 'Active',
    detail: 'All services enabled',
    icon: 'M9 12l2 2 4-4m-4 10a9 9 0 110-18 9 9 0 010 18z',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-300',
  },
])

const activityItems = [
  { title: 'Signed in', detail: 'Authenticated successfully', time: 'Just now' },
  { title: 'Location updated', detail: 'Current observation point refreshed', time: '2h ago' },
  { title: 'ISS data refreshed', detail: 'Pass predictions and orbital state updated', time: 'Today' },
  { title: 'Observation completed', detail: 'Sky conditions review finalized', time: 'Yesterday' },
]

const quickActions = [
  { label: 'Manage locations', route: '/locations', icon: 'M4 10h16M7 6h10M7 14h10M4 18h16' },
  { label: 'Sky radar', route: '/sky-radar', icon: 'M4 12h16M12 4v16' },
  { label: 'ISS tracker', route: '/iss', icon: 'M5 12h14M12 5v14' },
  { label: 'Dashboard', route: '/dashboard', icon: 'M4 5h16v14H4z' },
]

const preferences = [
  { label: 'Theme', value: theme.value === 'dark' ? 'Dark mode' : 'Light mode', helper: 'Adaptive appearance' },
  { label: 'Units', value: 'Metric', helper: 'Coordinates and altitude' },
  { label: 'Notifications', value: 'Enabled', helper: 'Observation reminders' },
]

function handleSave(): void {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}

function navigateTo(route: string): void {
  router.push(route)
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6">
    <section class="overflow-hidden rounded-[2.2rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-6 shadow-[0_32px_90px_rgba(3,7,18,0.24)] backdrop-blur-2xl lg:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--zenith-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--zenith-accent)] animate-pulse-glow" />
            Account dashboard
          </div>
          <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--zenith-text)] sm:text-4xl">
            Profile
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--zenith-text-muted)] sm:text-base">
            A refined place to review your account, keep track of your astronomy workflow, and move between mission-critical views with ease.
          </p>
        </div>
        <div class="flex flex-col gap-3 rounded-[1.35rem] border border-white/15 bg-gradient-to-br from-[var(--zenith-accent)]/12 to-sky-500/10 p-4 lg:min-w-[320px]">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--zenith-accent)] to-sky-500 text-lg font-semibold text-white shadow-[0_16px_40px_rgba(124,92,255,0.22)]">
              {{ user ? getInitials(user.username) : '?' }}
            </div>
            <div>
              <p class="font-semibold text-[var(--zenith-text)]">{{ user?.username }}</p>
              <p class="text-sm text-[var(--zenith-text-muted)]">{{ user?.email }}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
              Premium account
            </span>
            <span v-if="user?.createdAt" class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
              Member since {{ formatDateTime(user.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in accountOverview"
        :key="item.label"
        class="group rounded-[1.35rem] border border-white/15 bg-[var(--zenith-surface)]/70 p-4 shadow-[0_16px_50px_rgba(3,7,18,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(124,92,255,0.16)]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br" :class="item.accent">
            <svg class="h-5 w-5" :class="item.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
            </svg>
          </div>
          <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">
            Live
          </span>
        </div>
        <div class="mt-6">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">{{ item.label }}</p>
          <p class="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">{{ item.value }}</p>
          <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ item.detail }}</p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <BaseCard title="Account information" subtitle="Your primary profile details" hoverable>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Username</p>
            <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ user?.username }}</p>
          </div>
          <div class="rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Email</p>
            <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ user?.email }}</p>
          </div>
          <div class="rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">User ID</p>
            <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ user?.id?.slice(0, 12) ?? '—' }}...</p>
          </div>
          <div class="rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--zenith-text-subtle)]">Created</p>
            <p class="mt-2 text-sm font-semibold text-[var(--zenith-text)]">{{ user?.createdAt ? formatDateTime(user.createdAt) : '—' }}</p>
          </div>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSave">
          <BaseInput v-model="username" label="Username" />
          <BaseInput v-model="email" label="Email" type="email" disabled />
          <BaseButton type="submit">
            {{ saved ? 'Saved!' : 'Save Changes' }}
          </BaseButton>
        </form>
      </BaseCard>

      <BaseCard title="Activity & updates" subtitle="Recent account activity" hoverable>
        <div class="space-y-3">
          <div
            v-for="activity in activityItems"
            :key="activity.title"
            class="flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3"
          >
            <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)]">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 2" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-[var(--zenith-text)]">{{ activity.title }}</p>
                <span class="text-xs text-[var(--zenith-text-subtle)]">{{ activity.time }}</span>
              </div>
              <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ activity.detail }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <BaseCard title="Quick actions" subtitle="Jump into the main astronomy experiences" hoverable>
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="group rounded-[1.15rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--zenith-accent)]/40 hover:shadow-[0_16px_36px_rgba(124,92,255,0.16)]"
            @click="navigateTo(action.route)"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--zenith-accent)]/20 to-sky-500/20 text-[var(--zenith-accent)]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="action.icon" />
              </svg>
            </div>
            <p class="mt-3 font-semibold text-[var(--zenith-text)]">{{ action.label }}</p>
            <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">Open the related workspace</p>
          </button>
        </div>
      </BaseCard>

      <BaseCard title="Preferences" subtitle="Your current experience settings" hoverable>
        <div class="space-y-3">
          <div
            v-for="item in preferences"
            :key="item.label"
            class="rounded-[1.1rem] border border-white/10 bg-[var(--zenith-surface-elevated)]/80 p-3"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--zenith-text)]">{{ item.label }}</p>
                <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">{{ item.helper }}</p>
              </div>
              <span class="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-[var(--zenith-text-subtle)]">
                {{ item.value }}
              </span>
            </div>
          </div>
          <div class="rounded-[1.1rem] border border-white/10 bg-gradient-to-br from-[var(--zenith-accent)]/10 to-sky-500/10 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--zenith-text)]">Theme mode</p>
                <p class="mt-1 text-sm text-[var(--zenith-text-muted)]">Switch between dark and light appearance.</p>
              </div>
              <BaseButton variant="secondary" @click="toggleTheme">
                Switch to {{ theme === 'dark' ? 'Light' : 'Dark' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseCard title="Session" subtitle="Secure access on this device" hoverable>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[var(--zenith-text-muted)]">
          Sign out of your Zenith account on this device whenever you finish using the app.
        </p>
        <BaseButton variant="danger" @click="() => { logout(); router.push('/login') }">
          Sign Out
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>
