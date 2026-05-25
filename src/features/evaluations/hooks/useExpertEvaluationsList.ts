import { useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { filtersToApiParams, type ExpertEvaluationFilters } from '@/features/evaluations/expertFilters'
import { DEFAULT_PAGE, EXPERT_EVALUATIONS_PAGE_SIZE } from '@/lib/constants'
import { type EvaluationSummary } from '@/types/evaluation'

interface ExpertEvaluationsListState {
  items: EvaluationSummary[]
  total: number
  page: number
  pages: number
  size: number
  loading: boolean
  error: string | null
}

const INITIAL_STATE: ExpertEvaluationsListState = {
  items: [],
  total: 0,
  page: DEFAULT_PAGE,
  pages: 0,
  size: EXPERT_EVALUATIONS_PAGE_SIZE,
  loading: true,
  error: null,
}

export function useExpertEvaluationsList(filters: ExpertEvaluationFilters) {
  const [state, setState] = useState<ExpertEvaluationsListState>(INITIAL_STATE)

  useEffect(() => {
    let cancelled = false

    async function loadList() {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const result = await evaluationsApi.listEvaluations(filtersToApiParams(filters))
        if (cancelled) return
        setState({
          items: result.items,
          total: result.total,
          page: result.page,
          pages: result.pages,
          size: result.size,
          loading: false,
          error: null,
        })
      } catch {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: 'No se pudieron cargar las evaluaciones.',
          }))
        }
      }
    }

    loadList()
    return () => {
      cancelled = true
    }
  }, [filters])

  return state
}
