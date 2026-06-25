<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendar.store'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import CalendarDayPanel from '@/components/calendar/CalendarDayPanel.vue'

const store = useCalendarStore()

onMounted(() => {
  void store.loadMonth(store.currentYear, store.currentMonth)
})
</script>

<template>
  <main class="container mx-auto p-4 md:p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-[var(--zenith-text)]">
          Astronomy Calendar
        </h1>
        <p class="mt-2 text-[var(--zenith-text-muted)]">
          Explore upcoming celestial events, launches, and weather conditions.
        </p>
      </div>
    </div>

    <div v-if="store.error" class="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
      {{ store.error }}
      <button @click="store.loadMonth(store.currentYear, store.currentMonth)" class="ml-4 underline">Retry</button>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <CalendarGrid />
      </div>
      <div class="lg:col-span-1">
        <CalendarDayPanel />
      </div>
    </div>
  </main>
</template>
