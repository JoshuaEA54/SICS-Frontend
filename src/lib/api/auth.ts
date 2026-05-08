import { apiClient } from './client'
import { type TokenResponse, type GoogleTokenRequest } from '@/types/auth'

export const authApi = {
  loginWithGoogle: (body: GoogleTokenRequest) =>
    apiClient.post<TokenResponse>('/auth/google', body).then((r) => r.data),
}
