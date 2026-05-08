import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { toastError } from '@/store/toastStore'
import { loginErrorMessage } from '@/features/auth/utils'

export function useGoogleAuth() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSuccess = async (credential: string) => {
    try {
      const data = await authApi.loginWithGoogle({ credential })
      const user = data.user ?? (data.google_profile
        ? { id: 0, role: 'company_rep' as const, ...data.google_profile }
        : null)
      setAuth(user, data.access_token, data.refresh_token, data.flow)
      navigate(data.flow === 'new_company' ? '/registro' : '/evaluaciones')
    } catch (err) {
      toastError(loginErrorMessage(err))
    }
  }

  const handleError = () => {
    toastError('No fue posible conectar con Google. Intenta de nuevo.')
  }

  return { handleSuccess, handleError }
}
