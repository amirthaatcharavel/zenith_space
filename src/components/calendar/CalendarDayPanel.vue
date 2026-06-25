<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar.store'

const store = useCalendarStore()
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-[var(--zenith-surface)]/70 p-6 shadow-xl backdrop-blur-md h-full overflow-y-auto max-h-[800px]">
    <h3 class="mb-4 text-xl font-semibold text-[var(--zenith-text)]">
      Events for {{ store.selectedDate }}
    </h3>
    
    <div v-if="store.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl bg-white/5 p-4 h-24"></div>
    </div>
    
    <div v-else-if="store.eventsForSelectedDate.length === 0" class="text-sm text-[var(--zenith-text-muted)]">
      No astronomical events found for this day.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="event in store.eventsForSelectedDate" 
        :key="event.id"
        class="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
      >
        <div class="flex items-center justify-between mb-2">
          <span 
            class="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
            :class="[
              event.category === 'APOD' ? 'bg-purple-500/80' :
              event.category === 'WEATHER' ? 'bg-blue-400/80' :
              event.category === 'NEO' ? 'bg-red-500/80' :
              event.category === 'LAUNCH' ? 'bg-orange-500/80' : 'bg-green-400/80'
            ]"
          >
            {{ event.category }}
          </span>
          <span class="text-xs text-[var(--zenith-text-muted)]">{{ event.source }}</span>
        </div>
        <h4 class="font-medium text-[var(--zenith-text)]">{{ event.title }}</h4>
        <p v-if="event.description" class="mt-2 text-sm text-[var(--zenith-text-muted)] line-clamp-3">
          {{ event.description }}
        </p>
        
        <!-- Category Specific Meta Display -->
        <div v-if="event.category === 'APOD' && event.meta?.url" class="mt-3">
          <img v-if="event.meta.media_type === 'image'" :src="event.meta.url" alt="APOD" class="rounded-lg max-h-48 w-full object-cover" />
          <a v-else :href="event.meta.url" target="_blank" class="text-blue-400 hover:underline text-sm">View Media</a>
        </div>
        
        <div v-if="event.category === 'WEATHER'" class="mt-2 grid grid-cols-2 gap-2 text-sm text-[var(--zenith-text-muted)]">
          <div>Min: {{ event.meta?.tempMin }}°C</div>
          <div>Max: {{ event.meta?.tempMax }}°C</div>
        </div>
      </div>
    </div>
  </div>
</template>
