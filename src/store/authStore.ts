import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type User, type AuthFlow } from '@/types/auth'

interface AuthStore {
  user: User | null
  token: string | null
  refreshToken: string | null
  flow: AuthFlow | null
  isAuthenticated: boolean
  setAuth: (user: User | null, token: string, refreshToken: string, flow: AuthFlow) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      flow: null,
      isAuthenticated: false,
      setAuth: (user, token, refreshToken, flow) =>
        set({ user, token, refreshToken, flow, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, token: null, refreshToken: null, flow: null, isAuthenticated: false }),
    }),
    {
      name: 'sics-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        flow: state.flow,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
