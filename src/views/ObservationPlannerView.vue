<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useLocationStore } from '@/stores/location.store'
import { usePlannerStore } from '@/stores/planner.store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import type { ObservationPlanPayload } from '@/types/planner'

const authStore = useAuthStore()
const locationStore = useLocationStore()
const plannerStore = usePlannerStore()

const selectedLocationId = ref('')
const observationDate = ref('')
const selectedTargets = ref<string[]>([])
const formError = ref<string | null>(null)
const infoMessage = ref<string | null>(null)

const targetOptions = [
  'Moon',
  'Sun',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'ISS',
  'Orion Nebula',
  'Andromeda Galaxy',
  'Pleiades',
  'Polaris',
]

const savedLocations = computed(() => locationStore.savedLocations)
const isSaving = computed(() => plannerStore.loading)

function toggleTarget(target: string): void {
  if (selectedTargets.value.includes(target)) {
    selectedTargets.value = selectedTargets.value.filter((item) => item !== target)
    return
  }
  selectedTargets.value = [...selectedTargets.value, target]
}

function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getPlanCreatedLabel(createdAt: string): string {
  return new Date(createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function validateForm(): boolean {
  if (!selectedLocationId.value) {
    formError.value = 'Please choose a saved location.'
    return false
  }
  if (!observationDate.value) {
    formError.value = 'Please select an observation date.'
    return false
  }
  if (!selectedTargets.value.length) {
    formError.value = 'Please choose at least one celestial target.'
    return false
  }

  formError.value = null
  return true
}

async function handleSavePlan(): Promise<void> {
  if (!validateForm()) {
    infoMessage.value = null
    return
  }

  const location = savedLocations.value.find((loc) => loc.id === selectedLocationId.value)
  if (!location) {
    formError.value = 'Selected location was not found.'
    return
  }

  const payload: ObservationPlanPayload = {
    locationId: location.id,
    locationName: location.name,
    observationDate: observationDate.value,
    targets: [...selectedTargets.value],
  }

  try {
    await plannerStore.addPlan(payload)
    await plannerStore.loadPlans()
    infoMessage.value = 'Your observation plan has been saved.'
    selectedTargets.value = []
    observationDate.value = ''
    selectedLocationId.value = ''
    formError.value = null
  } catch {
    infoMessage.value = null
  }
}

onMounted(async () => {
  console.log("VIEW MOUNTED");
  console.log("CURRENT AUTH:", authStore.user);
  console.log("STORE PLAN COUNT BEFORE:", plannerStore.plans.length);
  await plannerStore.loadPlans();
  console.log("STORE PLAN COUNT AFTER:", plannerStore.plans.length);
  if (authStore.user) {
    void locationStore.loadLocations()
  }
})

watch(
    () => plannerStore.plans,
    (plans) => {
        console.log("PLANS CHANGED:", plans.length, plans);
    },
    { deep: true }
);
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <BaseCard title="Observation Planner" subtitle="Plan your next night under the stars" hoverable>
        <div class="space-y-6">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="flex flex-col gap-2 text-sm font-medium text-[var(--zenith-text)]">
              <span class="text-[var(--zenith-text-muted)]">Saved location</span>
              <select
                v-model="selectedLocationId"
                class="rounded-2xl border border-white/10 bg-[var(--zenith-surface)]/70 px-4 py-3 text-sm text-[var(--zenith-text)] outline-none transition duration-150 focus:border-[var(--zenith-accent)]/50 focus:ring-2 focus:ring-[var(--zenith-accent)]/10"
              >
                <option value="" disabled>Select a saved observation location</option>
                <option
                  v-for="location in savedLocations"
                  :key="location.id"
                  :value="location.id"
                >
                  {{ location.name }}
                </option>
              </select>
            </label>

            <BaseInput
              v-model="observationDate"
              label="Observation date"
              type="date"
              inputClass="w-full"
            />
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-[var(--zenith-text)]">Celestial targets</p>
                <p class="text-sm text-[var(--zenith-text-muted)]">Pick as many objects as you want for this plan.</p>
              </div>
              <span class="text-[11px] uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]">
                {‌{ selectedTargets.length }} selected
              </span>
            </div>
            <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="target in targetOptions"
                :key="target"
                type="button"
                class="rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200"
                :class="selectedTargets.includes(target)
                  ? 'border-[var(--zenith-accent)] bg-[var(--zenith-accent)]/12 text-[var(--zenith-text)] shadow-[0_10px_30px_rgba(124,92,255,0.18)]'
                  : 'border-white/10 bg-[var(--zenith-surface)]/70 text-[var(--zenith-text-muted)] hover:border-[var(--zenith-accent)]/30 hover:bg-white/10 hover:text-[var(--zenith-text)]'
                "
                @click="toggleTarget(target)"
              >
                {{ target }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <p v-if="formError" class="text-sm font-medium text-[var(--zenith-danger)]">{{ formError }}</p>
              <p v-if="infoMessage" class="text-sm font-medium text-[var(--zenith-success)]">{{ infoMessage }}</p>
            </div>
            <BaseButton type="button" :loading="isSaving" @click="handleSavePlan" block>
              Save observation plan
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <div class="space-y-6">
        <BaseCard title="Observation Preview" subtitle="Future features reserved" hoverable>
          <div class="space-y-4 text-sm text-[var(--zenith-text-muted)]">
            <p>Weather details and moon phase scoring will appear here in a future release.</p>
            <p>Once enabled, this section will help you choose the optimal observation window.</p>
          </div>
        </BaseCard>

        <BaseCard title="Planned observation notes" subtitle="What you can expect" hoverable>
          <div class="space-y-4 text-sm text-[var(--zenith-text-muted)]">
            <p>Save your locations, targets, and observation dates today.</p>
            <p>The planner automatically preserves your latest plans and keeps your setup organized.</p>
          </div>
        </BaseCard>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--zenith-text)]">Saved observation plans</h2>
          <p class="text-sm text-[var(--zenith-text-muted)]">Your most recent plans appear first.</p>
        </div>
        <p class="text-sm text-[var(--zenith-text-muted)]">
          {{ plannerStore.plans.length }} plan{{ plannerStore.plans.length === 1 ? '' : 's' }}
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <BaseCard
          v-for="plan in plannerStore.plans"
          :key="plan.id"
          class="h-full"
          hoverable
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm uppercase tracking-[0.2em] text-[var(--zenith-text-subtle)]">Location</p>
                <p class="mt-2 text-lg font-semibold text-[var(--zenith-text)]">{{ plan.locationName }}</p>
              </div>
              <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--zenith-text-subtle)]">
                {{ formatShortDate(plan.observationDate) }}
              </span>
            </div>

            <div class="rounded-[1.4rem] border border-white/10 bg-[var(--zenith-surface)]/70 p-4">
              <p class="text-sm font-medium text-[var(--zenith-text)]">Targets</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="target in plan.targets"
                  :key="target"
                  class="rounded-full border border-white/10 bg-[var(--zenith-accent)]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--zenith-accent)]"
                >
                  {{ target }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 text-sm text-[var(--zenith-text-muted)]">
              <p>Planned for</p>
              <p>{{ formatDisplayDate(plan.observationDate) }}</p>
            </div>
            <div class="flex items-center justify-between gap-3 text-sm text-[var(--zenith-text-muted)]">
              <p>Created</p>
              <p>{{ getPlanCreatedLabel(plan.createdAt) }}</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <p v-if="!plannerStore.plans.length && !plannerStore.loading" class="text-sm text-[var(--zenith-text-muted)]">
        No observation plans yet. Create your first plan to keep your next viewing session organized.
      </p>
    </section>
  </div>
</template>
