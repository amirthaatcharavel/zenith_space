<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar.store'

const store = useCalendarStore()

const daysInMonth = computed(() => {
  return new Date(store.currentYear, store.currentMonth, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(store.currentYear, store.currentMonth - 1, 1).getDay()
})

const days = computed(() => {
  const arr = []
  // padding for first week
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    arr.push({ date: null, events: [] })
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    const dString = `${store.currentYear}-${String(store.currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const dayEvents = store.events.filter(e => e.date.startsWith(dString))
    arr.push({ date: dString, dayNum: i, events: dayEvents })
  }
  return arr
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-[var(--zenith-surface)]/70 p-6 shadow-xl backdrop-blur-md">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-[var(--zenith-text)]">
        {{ new Date(store.currentYear, store.currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) }}
      </h2>
      <div class="flex gap-2">
        <button @click="store.prevMonth()" class="rounded-lg bg-white/5 p-2 text-white hover:bg-white/10 transition">Prev</button>
        <button @click="store.nextMonth()" class="rounded-lg bg-white/5 p-2 text-white hover:bg-white/10 transition">Next</button>
      </div>
    </div>
    
    <div v-if="store.loading" class="grid h-64 place-items-center text-[var(--zenith-text-muted)]">
      Loading events...
    </div>
    
    <div v-else class="grid grid-cols-7 gap-2">
      <div v-for="wd in weekDays" :key="wd" class="text-center text-xs font-semibold uppercase text-[var(--zenith-text-muted)]">
        {{ wd }}
      </div>
      
      <button 
        v-for="(day, idx) in days" 
        :key="idx"
        :disabled="!day.date"
        @click="day.date && store.selectDate(day.date)"
        class="relative min-h-[80px] rounded-xl border border-white/5 p-2 transition-all"
        :class="[
          day.date ? 'hover:border-[var(--zenith-accent)]/50 hover:bg-[var(--zenith-accent)]/10 cursor-pointer bg-[var(--zenith-surface)]/30' : 'bg-transparent cursor-default',
          store.selectedDate === day.date ? 'border-[var(--zenith-accent)] bg-[var(--zenith-accent)]/20 shadow-[0_0_15px_rgba(124,92,255,0.3)]' : ''
        ]"
      >
        <span v-if="day.date" class="absolute top-2 left-2 text-sm text-[var(--zenith-text)]">
          {{ day.dayNum }}
        </span>
        <div v-if="day.events && day.events.length" class="mt-6 flex flex-wrap gap-1">
          <div 
            v-for="event in day.events.slice(0, 3)" 
            :key="event.id"
            class="h-2 w-2 rounded-full"
            :class="[
              event.category === 'APOD' ? 'bg-purple-500' :
              event.category === 'WEATHER' ? 'bg-blue-400' :
              event.category === 'NEO' ? 'bg-red-500' :
              event.category === 'LAUNCH' ? 'bg-orange-500' : 'bg-green-400'
            ]"
            :title="event.title"
          ></div>
          <div v-if="day.events.length > 3" class="text-[10px] text-white/50">+{{ day.events.length - 3 }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
