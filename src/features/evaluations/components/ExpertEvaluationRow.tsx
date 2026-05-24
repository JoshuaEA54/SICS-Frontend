import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EvaluationBadge } from '@/components/ui/Badge'
import { ReviewProgressLabel } from '@/features/evaluations/components/ReviewProgressLabel'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface ExpertEvaluationRowProps {
  evaluation: EvaluationSummary
}

export function ExpertEvaluationRow({ evaluation }: ExpertEvaluationRowProps) {
  const navigate = useNavigate()
  const isPending = evaluation.status === 'submitted'
  const actionLabel = isPending ? 'Revisar' : 'Ver revisión'
  const actionVariant = isPending ? 'primary' : 'secondary'

  const handleAction = () => navigate(`/evaluaciones/${evaluation.id}`)

  return (
    <Card
      className={`p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
        isPending ? 'border-amber/40 bg-[#fffbeb]' : ''
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-lg font-semibold text-text-primary truncate">
            {evaluation.company_name ?? evaluation.company_id}
          </p>
          {evaluation.sector_name && (
            <span className="text-xs text-text-muted">· {evaluation.sector_name}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          {evaluation.submitted_at && (
            <span>Enviada el {formatDate(evaluation.submitted_at)}</span>
          )}
          {evaluation.reviewed_at && (
            <span>· Revisada el {formatDate(evaluation.reviewed_at)}</span>
          )}
        </div>

        {isPending && evaluation.review_progress && (
          <ReviewProgressLabel progress={evaluation.review_progress} />
        )}

        {!isPending && evaluation.compliance_percentage != null && (
          <span className="text-sm font-semibold text-text-primary tabular-nums">
            {evaluation.compliance_percentage.toFixed(1)}% cumplimiento
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
        <EvaluationBadge status={evaluation.status} />
        <Button variant={actionVariant} size="sm" onClick={handleAction}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  )
}
