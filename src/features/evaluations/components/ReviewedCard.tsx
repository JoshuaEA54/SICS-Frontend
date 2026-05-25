import { EvaluationBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, CheckSmIcon } from '@/components/ui/Icons'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'
import { ComplianceScore } from '@/features/evaluations/components/ComplianceScore'
import { getComplianceBand, getComplianceStyles } from '@/features/evaluations/complianceDisplay'

interface ReviewedCardProps {
  evaluation: EvaluationSummary
  num: number
  onViewReport?: () => void
}

export function ReviewedCard({ evaluation, num, onViewReport }: ReviewedCardProps) {
  const isReportPending =
    evaluation.report_status === 'generating' || evaluation.report_status === 'failed'
  const isReportReady = evaluation.report_status === 'ready'

  const band =
    evaluation.compliance_percentage != null
      ? getComplianceBand(evaluation.compliance_percentage)
      : null
  const bandLabel = band ? getComplianceStyles(band).label : 'Evaluación completada'

  const hasStats =
    evaluation.compliant_count != null && evaluation.total_controls != null

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-border bg-white shadow-[0px_4px_20px_0px_rgba(26,26,46,0.08)]">
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-primary/70" />

      <div className="flex items-start gap-6 px-6 pb-5 pt-[22px]">
        {/* ── Left column ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          {/* Label + badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10.6px] font-bold uppercase tracking-[0.95px] text-text-muted">
              Evaluación #{num}
            </span>
            <EvaluationBadge status="reviewed" />
          </div>

          {/* Title */}
          <h2 className="font-display text-[18.4px] font-semibold leading-[22px] tracking-[-0.28px] text-text-primary">
            {bandLabel}
          </h2>

          {/* Dates row */}
          <p className="text-[12.8px] font-light leading-[19.2px] text-text-muted">
            {evaluation.submitted_at && (
              <span>Enviada el {formatDate(evaluation.submitted_at)}</span>
            )}
            {evaluation.reviewed_at && (
              <span className="text-[#b0aaa0]">
                {evaluation.submitted_at ? ' · ' : ''}
                Revisada el {formatDate(evaluation.reviewed_at)}
              </span>
            )}
          </p>

          {/* Controls stat pill */}
          {hasStats && (
            <div className="flex w-fit items-center gap-1.5 rounded-[7px] bg-surface-bg px-3 py-2">
              <span className="text-teal"><CheckSmIcon /></span>
              <p className="text-[12.8px] text-text-secondary">
                <span className="font-semibold text-text-primary">
                  {evaluation.compliant_count}
                </span>
                {' de '}
                <span className="font-medium">
                  {evaluation.total_controls}
                </span>
                {' controles cumplen'}
              </p>
            </div>
          )}
        </div>

        {/* ── Right column: ring + button ── */}
        <div className="flex shrink-0 flex-col items-end gap-3.5">
          {evaluation.compliance_percentage != null ? (
            <ComplianceScore percentage={evaluation.compliance_percentage} size="md" />
          ) : (
            <div className="size-[80px]" />
          )}

          <Button
            variant="primary"
            size="md"
            disabled={!isReportReady}
            rightIcon={!isReportPending ? <ArrowRightIcon /> : undefined}
            onClick={isReportReady ? onViewReport : undefined}
          >
            {isReportPending ? 'Preparando informe…' : 'Ver informe'}
          </Button>
        </div>
      </div>
    </div>
  )
}
