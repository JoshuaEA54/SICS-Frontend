import { createBrowserRouter, redirect } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { QuestionnairePage } from '@/pages/QuestionnairePage'
import { EvaluationsPage } from '@/pages/EvaluationsPage'

function requireAuth() {
  const raw = localStorage.getItem('sics-auth')
  if (!raw) return redirect('/')
  const parsed = JSON.parse(raw) as { state?: { isAuthenticated?: boolean } }
  if (!parsed?.state?.isAuthenticated) return redirect('/')
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
    loader: requireAuth,
  },
  {
    path: '/cuestionario/:evaluationId',
    element: <QuestionnairePage />,
    loader: requireAuth,
  },
  {
    path: '/evaluaciones',
    element: <EvaluationsPage />,
    loader: requireAuth,
  },
])
