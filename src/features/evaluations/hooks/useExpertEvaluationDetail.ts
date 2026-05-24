import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { evaluationsApi } from '@/lib/api/evaluations'
import { useAuthStore } from '@/store/authStore'
import { type Evaluation } from '@/types/evaluation'

/** Detalle de una evaluación para revisión (pantalla `/evaluaciones/:id`). */
export function useExpertEvaluationDetail() {
  const { evaluationId } = useParams<{ evaluationId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isExpert = user?.role === 'expert'

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const goToInbox = useCallback(() => {
    navigate('/evaluaciones')
  }, [navigate])

  useEffect(() => {
    if (user && !isExpert) {
      navigate('/evaluaciones', { replace: true })
    }
  }, [user, isExpert, navigate])

  useEffect(() => {
    const id = evaluationId
    if (!id || !isExpert) return

    let cancelled = false

    async function loadEvaluation(evalId: string) {
      setLoading(true)
      setError(null)
      try {
        const data = await evaluationsApi.getEvaluation(evalId)
        if (cancelled) return
        setEvaluation(data)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('No se pudo cargar la evaluación.')
          setLoading(false)
        }
      }
    }

    loadEvaluation(id)
    return () => {
      cancelled = true
    }
  }, [evaluationId, isExpert])

  const displayTitle = useMemo(
    () => evaluation?.company_name ?? 'Evaluación',
    [evaluation?.company_name],
  )

  return {
    evaluation,
    loading,
    error,
    displayTitle,
    goToInbox,
  }
}
