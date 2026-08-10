import axios from 'axios'

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError<{ detail?: string }>(err)) return fallback
  return err.response?.data?.detail ?? fallback
}
