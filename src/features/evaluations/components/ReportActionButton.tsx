import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { evaluationsApi } from '@/lib/api/evaluations'
import { toastError, toastSuccess } from '@/store/toastStore'
import { type EvaluationSummary, type ReportStatus } from '@/types/evaluation'

interface ReportActionButtonProps {
  evaluation: EvaluationSummary
  onReportStatusChange?: (id: string, status: ReportStatus) => void
  onOpenReport: () => void
}

export function ReportActionButton({
  evaluation,
  onReportStatusChange,
  onOpenReport,
}: ReportActionButtonProps) {
  const [retrying, setRetrying] = useState(false)
  const status = evaluation.report_status

  if (!status) return null

  if (status === 'generating') {
    return (
      <Button variant="ghost" size="md" disabled>
        <span className="mr-1.5 size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Generando informe…
      </Button>
    )
  }

  if (status === 'ready') {
    return (
      <Button variant="ghost" size="md" onClick={onOpenReport}>
        Ver informe
      </Button>
    )
  }

  if (status === 'failed') {
    const handleRetry = async () => {
      if (retrying) return
      setRetrying(true)
      try {
        await evaluationsApi.regenerateReport(evaluation.id)
        onReportStatusChange?.(evaluation.id, 'generating')
        toastSuccess('Regeneración de informe iniciada.')
      } catch {
        toastError('No se pudo reintentar la generación del informe.')
      } finally {
        setRetrying(false)
      }
    }
    return (
      <Button variant="ghost" size="md" loading={retrying} onClick={handleRetry}>
        Reintentar crear informe
      </Button>
    )
  }

  return null
}
