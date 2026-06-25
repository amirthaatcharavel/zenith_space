import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCalendarEventsForMonth } from '@/services/calendar/calendar.service'
import type { CalendarEvent, MonthParams } from '@/types/calendar'
import { useLocationStore } from '@/stores/location.store'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const today = new Date()
  const selectedDate = ref<string>(today.toISOString().split('T')[0])
  const currentYear = ref<number>(today.getFullYear())
  const currentMonth = ref<number>(today.getMonth() + 1)

  const locationStore = useLocationStore()

  const eventsForSelectedDate = computed(() => {
    return events.value.filter((e) => e.date.startsWith(selectedDate.value))
  })

  async function loadMonth(year: number, month: number) {
    loading.value = true
    error.value = null
    currentYear.value = year
    currentMonth.value = month
    try {
      const lat = locationStore.currentLocation?.latitude
      const lon = locationStore.currentLocation?.longitude
      const params: MonthParams = { year, month, latitude: lat, longitude: lon }
      events.value = await getCalendarEventsForMonth(params)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load calendar events'
    } finally {
      loading.value = false
    }
  }

  function nextMonth() {
    let m = currentMonth.value + 1
    let y = currentYear.value
    if (m > 12) {
      m = 1
      y++
    }
    void loadMonth(y, m)
  }

  function prevMonth() {
    let m = currentMonth.value - 1
    let y = currentYear.value
    if (m < 1) {
      m = 12
      y--
    }
    void loadMonth(y, m)
  }

  function selectDate(date: string) {
    selectedDate.value = date
  }

  return {
    events,
    loading,
    error,
    selectedDate,
    currentYear,
    currentMonth,
    eventsForSelectedDate,
    loadMonth,
    nextMonth,
    prevMonth,
    selectDate
  }
})
