import { apiClient } from './client'
import { type TokenResponse, type GoogleTokenRequest } from '@/types/auth'

export const authApi = {
  loginWithGoogle: (body: GoogleTokenRequest) =>
    apiClient.post<TokenResponse>('/auth/google', body).then((r) => r.data),

  refresh: (refresh_token: string) =>
    apiClient.post<TokenResponse>('/auth/refresh', { refresh_token }).then((r) => r.data),
}
