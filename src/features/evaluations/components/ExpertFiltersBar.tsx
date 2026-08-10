import { useEffect, useState } from 'react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { companiesApi } from '@/lib/api/companies'
import { type Sector } from '@/types/company'
import {
  countActiveFilters,
  type ExpertEvaluationFilters,
  type ExpertStatusFilter,
} from '@/features/evaluations/expertFilters'
import { ExpertStatusFilterChips } from '@/features/evaluations/components/ExpertStatusFilterChips'
import { CompanyCombobox } from '@/features/evaluations/components/CompanyCombobox'

interface ExpertFiltersBarProps {
  filters: ExpertEvaluationFilters
  pendingCount: number
  reviewedCount: number
  summaryLoading?: boolean
  onFilterChange: <K extends keyof ExpertEvaluationFilters>(
    key: K,
    value: ExpertEvaluationFilters[K],
  ) => void
  onStatusChange: (status: ExpertStatusFilter) => void
  onClear: () => void
  hasActiveFilters: boolean
  disabled?: boolean
}

export function ExpertFiltersBar({
  filters,
  pendingCount,
  reviewedCount,
  summaryLoading,
  onFilterChange,
  onStatusChange,
  onClear,
  hasActiveFilters,
  disabled,
}: ExpertFiltersBarProps) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const activeCount = countActiveFilters(filters)
  const showStatusCounts = !filters.company_id && !filters.sector_id

  useEffect(() => {
    let cancelled = false
    companiesApi
      .getSectors()
      .then((sectorList) => {
        if (!cancelled) setSectors(sectorList)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
        <ExpertStatusFilterChips
          pending={pendingCount}
          reviewed={reviewedCount}
          activeStatus={filters.status}
          loading={summaryLoading}
          showCounts={showStatusCounts}
          onSelectStatus={onStatusChange}
        />

        <div className="hidden h-[38px] w-px shrink-0 self-end bg-border lg:block" aria-hidden />

        <CompanyCombobox
          value={filters.company_id}
          disabled={disabled}
          onChange={(companyId) => onFilterChange('company_id', companyId)}
        />

        <div className="min-w-[140px] sm:w-44">
          <Select
            value={filters.sector_id}
            disabled={disabled}
            placeholder="Sector"
            onChange={(e) => onFilterChange('sector_id', e.target.value)}
            options={[
              { value: '', label: 'Todos los sectores' },
              ...sectors.map((s) => ({ value: String(s.id), label: s.name })),
            ]}
            className="py-[9.4px]"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onClear}
            className="shrink-0 self-end lg:self-auto"
          >
            Limpiar filtros{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
        )}
      </div>
    </div>
  )
}
