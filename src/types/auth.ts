export type UserRole = 'company_rep' | 'expert'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  picture?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface GoogleTokenRequest {
  token: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
