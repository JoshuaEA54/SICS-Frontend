import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('sics-auth')
  if (raw) {
    const parsed = JSON.parse(raw) as { state?: { token?: string } }
    const token = parsed?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('sics-auth')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)
