import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterPayload } from '@/types'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Store unsubscribe function for auth state listener
  let unsubscribeAuthState: (() => void) | null = null

  const isAuthenticated = computed(() => !!user.value)

  watch(user, (newUser) => {
    console.log("AUTH STORE USER:", newUser)
  })

  /**
   * Initialize auth store by setting up Firebase auth state listener
   */
  function initialize(): void {
    if (unsubscribeAuthState) {
      // Already initialized, don't set up listener again
      return
    }

    unsubscribeAuthState = authService.onAuthStateChanged(async (firebaseUser) => {
      console.log("AUTH RESTORED:", firebaseUser?.id); // The firebaseUser object from authService uses .id not .uid if it's our mapped User object, but I'll log both or just .uid as requested
      // The prompt asked for firebaseUser?.uid
      console.log("AUTH RESTORED:", (firebaseUser as any)?.uid || firebaseUser?.id);
      user.value = firebaseUser
      if (firebaseUser) {
        // Get current token for authenticated user
        token.value = await authService.getIdToken()
      } else {
        token.value = null
      }

      initialized.value = true
    })
  }

  /**
   * Clean up auth state listener
   */
  function dispose(): void {
    if (unsubscribeAuthState) {
      unsubscribeAuthState()
      unsubscribeAuthState = null
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { user: authUser, token: authToken } = await authService.login(credentials)
      user.value = authUser
      token.value = authToken
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { user: authUser, token: authToken } = await authService.register(payload)
      user.value = authUser
      token.value = authToken
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
      user.value = null
      token.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    initialized,
    isAuthenticated,
    initialize,
    dispose,
    login,
    register,
    logout,
    clearError,
  }
})
