import { useCallback, useMemo, useState } from 'react'
import {
  applyEvaluationPatch,
  reportStatusOverrides,
} from '@/features/evaluations/evaluationPatch'
import { useExpertEvaluationsInbox } from '@/features/evaluations/hooks/useExpertEvaluationsInbox'
import {
  useReportStatusPolling,
  type ReportStatusPatch,
} from '@/features/evaluations/hooks/useReportStatusPolling'

/** Bandeja del experto con overrides locales de estado de informe y polling. */
export function useExpertEvaluationsDashboard() {
  const inbox = useExpertEvaluationsInbox()
  const [patches, setPatches] = useState<Record<string, ReportStatusPatch>>({})

  const patchEvaluation = useCallback((id: string, patch: ReportStatusPatch) => {
    setPatches((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }, [])

  const statusOverrides = useMemo(() => reportStatusOverrides(patches), [patches])

  useReportStatusPolling({
    evaluations: inbox.items,
    statusOverrides,
    onPatch: patchEvaluation,
    enabled: !inbox.loading && inbox.items.length > 0,
  })

  const items = useMemo(
    () => inbox.items.map((evaluation) => applyEvaluationPatch(evaluation, patches[evaluation.id])),
    [inbox.items, patches],
  )

  return {
    ...inbox,
    items,
    patchEvaluation,
  }
}
