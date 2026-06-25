import type { LoginCredentials, RegisterPayload, User } from '@/types'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/firebase/config'

/**
 * Maps Firebase User to application User interface
 */
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
    avatarUrl: firebaseUser.photoURL || undefined,
    createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
  }
}

export const authService = {
  /**
   * Get Firebase ID token for the current user
   */
  async getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null
    try {
      return await auth.currentUser.getIdToken()
    } catch {
      return null
    }
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      const user = mapFirebaseUser(userCredential.user)
      const token = await userCredential.user.getIdToken()

      return { user, token }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Login failed'
      )
    }
  },

  /**
   * Register with email and password
   */
  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      )

      // Optionally update user profile with username
      // Note: Firebase doesn't have a username field, so we use displayName
      if (payload.username) {
        const firebaseUser = userCredential.user as FirebaseUser & {
          updateProfile: (profile: { displayName: string }) => Promise<void>
        }

        await firebaseUser.updateProfile({
          displayName: payload.username,
        })
      }

      const user = mapFirebaseUser(userCredential.user)
      const token = await userCredential.user.getIdToken()

      return { user, token }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed'
      )
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<{ user: User; token: string }> {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      const user = mapFirebaseUser(userCredential.user)
      const token = await userCredential.user.getIdToken()

      return { user, token }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Google sign-in failed'
      )
    }
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Logout failed'
      )
    }
  },

  /**
   * Subscribe to auth state changes
   * Returns unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(mapFirebaseUser(firebaseUser))
      } else {
        callback(null)
      }
    })
  },
}
