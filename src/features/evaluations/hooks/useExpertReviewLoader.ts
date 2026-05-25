import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { controlsApi } from '@/lib/api/controls'
import { evaluationsApi } from '@/lib/api/evaluations'
import { type ControlGroup } from '@/types/controls'
import { type Evaluation, type Response } from '@/types/evaluation'
import { useAuthStore } from '@/store/authStore'
import { toastError } from '@/store/toastStore'

export function useExpertReviewLoader(evaluationId: string) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isExpert = user?.role === 'expert'

  const [groups, setGroups] = useState<ControlGroup[]>([])
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const groupsRef = useRef<ControlGroup[]>([])
  groupsRef.current = groups

  useEffect(() => {
    if (user && !isExpert) {
      navigate('/evaluaciones', { replace: true })
    }
  }, [user, isExpert, navigate])

  const load = useCallback(async () => {
    if (!evaluationId || !isExpert) return
    setLoading(true)
    setError(null)
    try {
      const [groupsData, evalData, responsesData] = await Promise.all([
        controlsApi.getGroupsFull(),
        evaluationsApi.getEvaluation(evaluationId),
        evaluationsApi.getResponses(evaluationId),
      ])

      if (evalData.status === 'draft') {
        toastError('Esta evaluación aún no ha sido enviada.')
        navigate('/evaluaciones', { replace: true })
        return
      }

      setGroups(groupsData)
      setEvaluation(evalData)
      setResponses(responsesData)
    } catch {
      setError('No se pudo cargar la evaluación.')
    } finally {
      setLoading(false)
    }
  }, [evaluationId, isExpert, navigate])

  useEffect(() => {
    load()
  }, [load])

  const responsesByControlId = Object.fromEntries(responses.map((r) => [r.control_id, r]))

  return {
    groups,
    evaluation,
    setEvaluation,
    responses,
    setResponses,
    responsesByControlId,
    loading,
    error,
    reload: load,
  }
}
