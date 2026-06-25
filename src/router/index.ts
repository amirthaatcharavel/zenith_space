import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { layout: 'default', public: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'auth', public: true, guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { layout: 'auth', public: true, guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/radar',
      name: 'radar',
      component: () => import('@/views/SkyRadarView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/iss',
      name: 'iss',
      component: () => import('@/views/ISSView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('@/views/SavedLocationsView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('@/views/ObservationPlannerView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { layout: 'default', public: true },
    },
  ],
})

async function waitForAuthInitialized(authStore: ReturnType<typeof useAuthStore>) {
  if (authStore.initialized) {
    return
  }

  await new Promise<void>((resolve) => {
    const stop = watch(
      () => authStore.initialized,
      (value) => {
        if (value) {
          stop()
          resolve()
        }
      },
      { immediate: true }
    )
  })
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  await waitForAuthInitialized(authStore)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
