import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EvaluationBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, CheckSmIcon, ClockIcon } from '@/components/ui/Icons'
import { ComplianceScore } from '@/features/evaluations/components/ComplianceScore'
import { ReportDeliveryButton } from '@/features/evaluations/components/ReportDeliveryButton'
import { ReportDeliveryModal } from '@/features/evaluations/components/ReportDeliveryModal'
import { ReportPreviewModal } from '@/features/evaluations/components/ReportPreviewModal'
import { useReportPreview } from '@/features/evaluations/hooks/useReportPreview'
import { type ReportStatusPatch } from '@/features/evaluations/hooks/useReportStatusPolling'
import { getComplianceBand, getComplianceStyles } from '@/features/evaluations/complianceDisplay'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface ExpertEvaluationRowProps {
  evaluation: EvaluationSummary
  onEvaluationPatch: (id: string, patch: ReportStatusPatch) => void
}

export function ExpertEvaluationRow({ evaluation, onEvaluationPatch }: ExpertEvaluationRowProps) {
  const navigate = useNavigate()
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const isPending = evaluation.status === 'submitted'
  const isReviewed = evaluation.status === 'reviewed'

  const {
    reportOpen,
    reportLoading,
    reportBlobUrl,
    activeReportEvaluation,
    openReport,
    closeReport,
    downloadReport,
  } = useReportPreview()

  const handleAction = () => navigate(`/evaluaciones/${evaluation.id}`)
  const handleOpenDelivery = () => setDeliveryOpen(true)
  const handlePreviewFromDelivery = () => {
    setDeliveryOpen(false)
    void openReport(evaluation)
  }

  const companyLabel = evaluation.company_name ?? evaluation.company_id
  const band =
    evaluation.compliance_percentage != null
      ? getComplianceBand(evaluation.compliance_percentage)
      : null
  const bandLabel = band ? getComplianceStyles(band).label : 'Evaluación completada'
  const hasStats =
    evaluation.compliant_count != null && evaluation.total_controls != null
  const hasProgress = isPending && evaluation.review_progress != null

  const reportTitle =
    activeReportEvaluation?.company_name ??
    activeReportEvaluation?.company_id ??
    'Informe de evaluación'

  return (
    <>
      <div className="relative overflow-hidden rounded-[14px] border border-border bg-white shadow-[0px_4px_20px_0px_rgba(26,26,46,0.08)]">
        <div
          className={`absolute inset-x-0 top-0 h-[3px] ${isPending ? 'bg-amber/70' : 'bg-primary/70'}`}
        />

        <div className="flex items-start gap-6 px-6 pb-5 pt-[22px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-md font-normal text-text-primary tracking-wide">
                {companyLabel}
                {evaluation.sector_name && (
                  <span className="text-sm font-normal text-text-subtle">
                    {' ' + ' · ' + evaluation.sector_name}
                  </span>
                )}
              </span>
              <EvaluationBadge status={isPending ? 'submitted' : 'reviewed'} />
            </div>

            <h2 className="font-display text-lg font-semibold leading-[22px] tracking-[-0.28px] text-text-primary">
              {isPending ? companyLabel : bandLabel}
            </h2>

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
              {evaluation.report_email_sent_at && (
                <span className="text-[#b0aaa0]">
                  {' · '}
                  Informe enviado el {formatDate(evaluation.report_email_sent_at)}
                </span>
              )}
            </p>

            {hasProgress && evaluation.review_progress && (
              <div className="flex w-fit items-center gap-1.5 rounded-[7px] bg-surface-bg px-3 py-2">
                <span className="text-amber">
                  <ClockIcon size={14} />
                </span>
                <p className="text-[12.8px] text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    {evaluation.review_progress.completed}
                  </span>
                  {' de '}
                  <span className="font-medium">{evaluation.review_progress.required}</span>
                  {' veredictos emitidos'}
                </p>
              </div>
            )}

            {isReviewed && hasStats && (
              <div className="flex w-fit items-center gap-1.5 rounded-[7px] bg-surface-bg px-3 py-2">
                <span className="text-teal">
                  <CheckSmIcon />
                </span>
                <p className="text-[12.8px] text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    {evaluation.compliant_count}
                  </span>
                  {' de '}
                  <span className="font-medium">{evaluation.total_controls}</span>
                  {' controles cumplen'}
                </p>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3.5">
            {isReviewed && evaluation.compliance_percentage != null && band ? (
              <ComplianceScore percentage={evaluation.compliance_percentage} size="md" />
            ) : (
              <div className="size-[80px]" />
            )}

            <div className="flex items-center gap-2">
              {isReviewed && (
                <ReportDeliveryButton evaluation={evaluation} onClick={handleOpenDelivery} />
              )}
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRightIcon />}
                onClick={handleAction}
              >
                {isPending ? 'Revisar' : 'Ver revisión'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ReportDeliveryModal
        open={deliveryOpen}
        evaluation={evaluation}
        onClose={() => setDeliveryOpen(false)}
        onPreviewReport={handlePreviewFromDelivery}
        onPatch={onEvaluationPatch}
      />

      <ReportPreviewModal
        open={reportOpen}
        loading={reportLoading}
        blobUrl={reportBlobUrl}
        title={reportTitle}
        onClose={closeReport}
        onDownload={downloadReport}
      />
    </>
  )
}
