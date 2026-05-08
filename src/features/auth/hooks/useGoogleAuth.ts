import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { toastError } from '@/store/toastStore'
import { loginErrorMessage } from '@/features/auth/utils'

export function useGoogleAuth() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const handleSuccess = async (credential: string) => {
    clearAuth()
    try {
      const data = await authApi.loginWithGoogle({ credential })
      setAuth(data.user, data.access_token, data.refresh_token, data.flow)
      navigate(data.flow === 'new_company' || !data.user ? '/registro' : '/evaluaciones')
    } catch (err) {
      toastError(loginErrorMessage(err))
    }
  }

  const handleError = () => {
    toastError('No fue posible conectar con Google. Intenta de nuevo.')
  }

  return { handleSuccess, handleError }
}
