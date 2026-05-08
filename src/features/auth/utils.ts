import axios from 'axios'

export function loginErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Ocurrió un error inesperado. Intenta de nuevo.'
  if (!error.response) return 'No se pudo conectar con el servidor. Verifica tu conexión.'
  const status = error.response.status
  if (status === 401) return 'Tu sesión de Google no pudo verificarse. Intenta iniciar de nuevo.'
  if (status === 409) return 'Esta cuenta ya está registrada con otro método de acceso.'
  if (status >= 500) return 'El servidor no está disponible. Intenta en unos minutos.'
  return 'No fue posible iniciar sesión. Intenta de nuevo.'
}
