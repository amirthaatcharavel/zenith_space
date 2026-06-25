import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import type { ObservationPlan, ObservationPlanPayload } from '@/types/planner'
import { loadObservationPlans, createObservationPlan } from '@/services/planner.service'

export const usePlannerStore = defineStore('planner', () => {
  const plans = ref<ObservationPlan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  const authStore = useAuthStore()

  async function loadPlans(): Promise<void> {
    console.log("========== LOAD PLANS ==========");
    console.log("AUTH USER:", authStore.user);
    console.log("UID:", authStore.user?.id);
    error.value = null
    success.value = null

    if (!authStore.user) {
      console.warn("AUTH USER IS NULL - RETURNING");
      plans.value = []
      return
    }

    loading.value = true

    try {
      plans.value = await loadObservationPlans(authStore.user.id)
      console.log("STORE PLAN COUNT:", plans.value.length);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load observation plans'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => authStore.user?.id,
    async (uid) => {
      if (uid) {
        await loadPlans()
      } else {
        plans.value = []
      }
    },
    { immediate: true }
  )

  async function addPlan(payload: ObservationPlanPayload): Promise<void> {
    const authStore = useAuthStore()
    error.value = null
    success.value = null

    if (!authStore.user) {
      throw new Error('Unable to save observation plan without an authenticated user.')
    }

    loading.value = true

    try {
      const createdPlan = await createObservationPlan(authStore.user.id, payload)
      plans.value = [createdPlan, ...plans.value]
      success.value = 'Observation plan saved successfully.'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save observation plan'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearMessages(): void {
    error.value = null
    success.value = null
  }

  return {
    plans,
    loading,
    error,
    success,
    loadPlans,
    addPlan,
    clearMessages,
  }
})
