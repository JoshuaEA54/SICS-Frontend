import { useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { useAuthStore } from '@/store/authStore'
import { type EvaluationSummary } from '@/types/evaluation'

interface CompanyEvaluationsState {
  submitted: EvaluationSummary[]
  reviewed: EvaluationSummary[]
  hasSubmitted: boolean
  loading: boolean
  error: string | null
}

export function useCompanyEvaluations() {
  const companyId = useAuthStore((s) => s.user?.company_id)

  const [state, setState] = useState<CompanyEvaluationsState>({
    submitted: [],
    reviewed: [],
    hasSubmitted: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!companyId) {
      setState((s) => ({ ...s, loading: false }))
      return
    }

    let cancelled = false

    async function load() {
      try {
        const all = await evaluationsApi.getEvaluations({ company_id: companyId })
        if (cancelled) return

        const submitted = all.filter((e) => e.status === 'submitted')
        const reviewed = all
          .filter((e) => e.status === 'reviewed')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setState({ submitted, reviewed, hasSubmitted: submitted.length > 0, loading: false, error: null })
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: 'No se pudieron cargar las evaluaciones.' }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [companyId])

  return state
}
