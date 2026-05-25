import { getPaginationRange } from '@/features/evaluations/expertFilters'
import { useExpertEvaluationsList } from '@/features/evaluations/hooks/useExpertEvaluationsList'
import { useExpertEvaluationsSummary } from '@/features/evaluations/hooks/useExpertEvaluationsSummary'
import { useExpertFilterParams } from '@/features/evaluations/hooks/useExpertFilterParams'

/** Bandeja del experto: filtros, listado paginado y contadores. */
export function useExpertEvaluationsInbox() {
  const { filters, setFilter, clearFilters, setStatusFilter, activeFilters } =
    useExpertFilterParams()
  const list = useExpertEvaluationsList(filters)
  const { summary, summaryLoading } = useExpertEvaluationsSummary()
  const { rangeStart, rangeEnd } = getPaginationRange(list.page, list.size, list.total)

  return {
    ...list,
    summary,
    summaryLoading,
    filters,
    setFilter,
    clearFilters,
    setStatusFilter,
    activeFilters,
    rangeStart,
    rangeEnd,
  }
}
