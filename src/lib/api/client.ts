import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/')
    const isRetry = error.config?._retry

    if (error.response?.status === 401 && !isAuthRoute && !isRetry) {
      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()

      if (refreshToken) {
        try {
          const { authApi } = await import('./auth')
          const data = await authApi.refresh(refreshToken)
          setAuth(data.user ?? null, data.access_token, data.refresh_token, data.flow)
          error.config._retry = true
          error.config.headers.Authorization = `Bearer ${data.access_token}`
          return apiClient(error.config)
        } catch {
          // refresh falló
        }
      }

      clearAuth()
      window.location.href = '/'
    }

    return Promise.reject(error)
  },
)
