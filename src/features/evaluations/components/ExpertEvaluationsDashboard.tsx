import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { ExpertFiltersBar } from '@/features/evaluations/components/ExpertFiltersBar'
import { ExpertEvaluationRow } from '@/features/evaluations/components/ExpertEvaluationRow'
import { useExpertEvaluationsInbox } from '@/features/evaluations/hooks/useExpertEvaluationsInbox'
import { type ReportStatus } from '@/types/evaluation'

export function ExpertEvaluationsDashboard() {
  const {
    items,
    total,
    page,
    pages,
    loading,
    error,
    summary,
    summaryLoading,
    filters,
    setFilter,
    clearFilters,
    setStatusFilter,
    activeFilters,
    rangeStart,
    rangeEnd,
  } = useExpertEvaluationsInbox()

  // Local overrides for report_status after Reintentar (avoids full reload)
  const [reportStatusOverrides, setReportStatusOverrides] = useState<Record<string, ReportStatus>>({})

  const handleReportStatusChange = useCallback((id: string, status: ReportStatus) => {
    setReportStatusOverrides((prev) => ({ ...prev, [id]: status }))
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-semibold text-text-primary">
          Bandeja de evaluaciones
        </h1>
        <p className="mt-1 text-[13px] text-text-secondary">
          Encuentre evaluaciones enviadas por las empresas y continúe la revisión.
        </p>
      </header>

      <div className="mb-6">
        <ExpertFiltersBar
          filters={filters}
          pendingCount={summary.pending}
          reviewedCount={summary.reviewed}
          summaryLoading={summaryLoading}
          onFilterChange={setFilter}
          onStatusChange={setStatusFilter}
          onClear={clearFilters}
          hasActiveFilters={activeFilters}
          disabled={loading}
        />
      </div>

      {!loading && !error && (
        <p className="mb-4 text-sm text-text-secondary">
          {total === 0
            ? 'Sin resultados'
            : `Mostrando ${rangeStart}–${rangeEnd} de ${total} · Página ${page} de ${Math.max(pages, 1)}`}
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-text-secondary">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-[13px] text-text-muted">
            {activeFilters
              ? 'No hay evaluaciones con estos filtros. Pruebe limpiar los criterios.'
              : 'No hay evaluaciones pendientes ni revisadas.'}
          </p>
          {activeFilters && (
            <Button variant="ghost" size="sm" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {items.map((evaluation) => (
              <ExpertEvaluationRow
                key={evaluation.id}
                evaluation={
                  reportStatusOverrides[evaluation.id]
                    ? { ...evaluation, report_status: reportStatusOverrides[evaluation.id] }
                    : evaluation
                }
                onReportStatusChange={handleReportStatusChange}
              />
            ))}
          </div>

          <Pagination
            className="mt-6"
            page={page}
            pages={pages}
            onPageChange={(nextPage) => setFilter('page', nextPage)}
          />
        </>
      )}
    </div>
  )
}
