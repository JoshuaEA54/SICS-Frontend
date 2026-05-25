import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_EXPERT_FILTERS,
  buildNextFilter,
  filtersFromSearchParams,
  filtersToSearchParams,
  hasActiveFilters,
  type ExpertEvaluationFilters,
  type ExpertStatusFilter,
} from '@/features/evaluations/expertFilters'

export function useExpertFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams])

  const applyFilters = useCallback(
    (next: ExpertEvaluationFilters) => {
      setSearchParams(filtersToSearchParams(next), { replace: true })
    },
    [setSearchParams],
  )

  const setFilter = useCallback(
    <K extends keyof ExpertEvaluationFilters>(key: K, value: ExpertEvaluationFilters[K]) => {
      applyFilters(buildNextFilter(filters, key, value))
    },
    [applyFilters, filters],
  )

  const clearFilters = useCallback(() => {
    applyFilters(DEFAULT_EXPERT_FILTERS)
  }, [applyFilters])

  const setStatusFilter = useCallback(
    (status: ExpertStatusFilter) => setFilter('status', status),
    [setFilter],
  )

  return {
    filters,
    setFilter,
    clearFilters,
    setStatusFilter,
    activeFilters: hasActiveFilters(filters),
  }
}
