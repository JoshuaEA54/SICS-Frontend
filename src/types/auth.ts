export type UserRole = 'company_rep' | 'expert'
export type AuthFlow = 'expert' | 'existing_company' | 'new_company'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  picture?: string
  company_id?: string
  job_title?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  flow: AuthFlow | null
  isAuthenticated: boolean
}

export interface GoogleTokenRequest {
  credential: string
}

export interface GoogleProfile {
  name: string
  email: string
  picture?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  flow: AuthFlow
  user: User | null
  google_profile: GoogleProfile | null
}
