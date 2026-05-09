import { useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { type EvaluationSummary } from '@/types/evaluation'

interface ExpertEvaluationsState {
  pending: EvaluationSummary[]
  reviewed: EvaluationSummary[]
  loading: boolean
  error: string | null
}

export function useExpertEvaluations() {
  const [state, setState] = useState<ExpertEvaluationsState>({
    pending: [],
    reviewed: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [pending, reviewed] = await Promise.all([
          evaluationsApi.getEvaluations({ status: 'submitted' }),
          evaluationsApi.getEvaluations({ status: 'reviewed' }),
        ])
        if (!cancelled) setState({ pending, reviewed, loading: false, error: null })
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: 'No se pudieron cargar las evaluaciones.' }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return state
}
