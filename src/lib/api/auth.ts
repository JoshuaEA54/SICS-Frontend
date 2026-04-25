import { apiClient } from './client'
import { type AuthResponse, type GoogleTokenRequest } from '@/types/auth'

export const authApi = {
  loginWithGoogle: (body: GoogleTokenRequest) =>
    apiClient.post<AuthResponse>('/auth/google', body).then((r) => r.data),
}
