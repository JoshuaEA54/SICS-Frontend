import { Button } from '@/components/ui/Button'
import { XIcon } from '@/components/ui/Icons'
import { ReportRecipientsList } from '@/features/evaluations/components/ReportRecipientsList'
import { useReportDeliveryModal } from '@/features/evaluations/hooks/useReportDeliveryModal'
import { type ReportStatusPatch } from '@/features/evaluations/hooks/useReportStatusPolling'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface ReportDeliveryModalProps {
  open: boolean
  evaluation: EvaluationSummary
  onClose: () => void
  onPreviewReport: () => void
  onPatch: (id: string, patch: ReportStatusPatch) => void
}

export function ReportDeliveryModal({
  open,
  evaluation,
  onClose,
  onPreviewReport,
  onPatch,
}: ReportDeliveryModalProps) {
  const {
    reportStatus,
    reportError,
    sentAt,
    sentTo,
    recipients,
    loadingRecipients,
    retrying,
    sending,
    handleRetry,
    handleSend,
  } = useReportDeliveryModal({ open, evaluation, onPatch })

  if (!open) return null

  const companyLabel = evaluation.company_name ?? evaluation.company_id

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary">Informe — {companyLabel}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Entrega del PDF a la empresa tras la revisión.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text-muted hover:bg-surface-bg hover:text-text-primary"
            aria-label="Cerrar"
          >
            <XIcon />
          </button>
        </div>

        {reportStatus === 'generating' && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-text-secondary">
              Estamos generando el informe PDF. Esto puede tardar unos segundos.
            </p>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}

        {reportStatus === 'failed' && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              No se pudo generar el informe PDF.
              {reportError ? ` ${reportError}` : ''}
            </p>
            <Button variant="primary" size="md" loading={retrying} onClick={handleRetry}>
              Reintentar generación
            </Button>
          </div>
        )}

        {reportStatus === 'ready' && !sentAt && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              El informe está listo. Se enviará por correo a los destinatarios registrados de la
              empresa.
            </p>
            {loadingRecipients ? (
              <div className="flex justify-center py-4">
                <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <ReportRecipientsList recipients={recipients} />
            )}
            <div className="flex w-full flex-col items-center gap-2 pt-2">
              <Button variant="ghost" size="md" className="w-full" onClick={onPreviewReport}>
                Vista previa del PDF
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                loading={sending}
                disabled={loadingRecipients || recipients.length === 0}
                onClick={handleSend}
              >
                Enviar informe por correo
              </Button>
            </div>
          </div>
        )}

        {sentAt && (
          <div className="space-y-4">
            <p className="text-sm text-teal-dark">
              Enviado el {formatDate(sentAt)}
              {sentTo && sentTo.length > 0 ? ` a ${sentTo.length} destinatario(s).` : '.'}
            </p>
            {sentTo && sentTo.length > 0 && (
              <ReportRecipientsList
                recipients={sentTo.map((email) => ({ email, label: 'Destinatario' }))}
              />
            )}
            <Button variant="ghost" size="md" onClick={onPreviewReport}>
              Vista previa del PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
