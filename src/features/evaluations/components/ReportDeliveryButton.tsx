import { Button } from '@/components/ui/Button'
import { type EvaluationSummary } from '@/types/evaluation'

interface ReportDeliveryButtonProps {
  evaluation: EvaluationSummary
  onClick: () => void
}

export function ReportDeliveryButton({ evaluation, onClick }: ReportDeliveryButtonProps) {
  const status = evaluation.report_status
  if (!status) return null

  const readyToSend = status === 'ready' && !evaluation.report_email_sent_at
  const isGenerating = status === 'generating'
  const isFailed = status === 'failed'

  return (
    <Button variant="ghost" size="md" onClick={onClick} className="relative">
      {isGenerating && (
        <span className="mr-1.5 size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      Informe
      {readyToSend && (
        <span className="ml-1.5 rounded-full bg-teal-muted px-2 py-0.5 text-[10px] font-semibold text-teal-dark">
          Por enviar
        </span>
      )}
      {isFailed && (
        <span className="ml-1.5 size-2 rounded-full bg-amber" aria-hidden />
      )}
    </Button>
  )
}
