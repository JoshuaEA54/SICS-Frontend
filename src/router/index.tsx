import { createBrowserRouter, redirect } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RegisterStep2Page } from '@/pages/RegisterStep2Page'
import { QuestionnairePage } from '@/pages/QuestionnairePage'
import { EvaluationsPage } from '@/pages/EvaluationsPage'
import { type User } from '@/types/auth'

function getUser(): User | null {
  try {
    const raw = localStorage.getItem('sics-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { isAuthenticated?: boolean; user?: User } }
    if (!parsed?.state?.isAuthenticated) return null
    return parsed.state.user ?? null
  } catch {
    return null
  }
}

// Solo para usuarios en paso 1: sin empresa aún
function requireStep1() {
  const user = getUser()
  if (!user) return redirect('/')
  if (user.job_title) return redirect('/evaluaciones')
  if (user.company_id) return redirect('/registro/paso-2')
  return null
}

// Solo para usuarios en paso 2: tienen empresa pero sin cargo
function requireStep2() {
  const user = getUser()
  if (!user) return redirect('/')
  if (user.job_title) return redirect('/evaluaciones')
  if (!user.company_id) return redirect('/registro')
  return null
}

// Requiere registro completo (paso 1 + paso 2) o rol experto
function requireRegistered() {
  const user = getUser()
  if (!user) return redirect('/')
  if (user.role === 'expert') return null
  if (!user.company_id) return redirect('/registro')
  if (!user.job_title) return redirect('/registro/paso-2')
  return null
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/registro',
    element: <RegisterPage />,
    loader: requireStep1,
  },
  {
    path: '/registro/paso-2',
    element: <RegisterStep2Page />,
    loader: requireStep2,
  },
  {
    path: '/cuestionario/:evaluationId',
    element: <QuestionnairePage />,
    loader: requireRegistered,
  },
  {
    path: '/evaluaciones',
    element: <EvaluationsPage />,
    loader: requireRegistered,
  },
])
