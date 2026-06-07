import { useCallback, useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { REPORT_STATUS_POLL_MS } from '@/lib/constants'
import { toastError, toastSuccess } from '@/store/toastStore'
import { type ReportStatusPatch } from '@/features/evaluations/hooks/useReportStatusPolling'
import { type EvaluationSummary, type ReportRecipient } from '@/types/evaluation'

interface UseReportDeliveryModalOptions {
  open: boolean
  evaluation: EvaluationSummary
  onPatch: (id: string, patch: ReportStatusPatch) => void
}

export function useReportDeliveryModal({
  open,
  evaluation,
  onPatch,
}: UseReportDeliveryModalOptions) {
  const [reportStatus, setReportStatus] = useState(evaluation.report_status)
  const [reportError, setReportError] = useState(evaluation.report_error ?? null)
  const [sentAt, setSentAt] = useState(evaluation.report_email_sent_at ?? null)
  const [sentTo, setSentTo] = useState(evaluation.report_email_sent_to ?? null)
  const [recipients, setRecipients] = useState<ReportRecipient[]>([])
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return
    setReportStatus(evaluation.report_status)
    setReportError(evaluation.report_error ?? null)
    setSentAt(evaluation.report_email_sent_at ?? null)
    setSentTo(evaluation.report_email_sent_to ?? null)
  }, [open, evaluation])

  const syncFromServer = useCallback(
    async (silent = false) => {
      try {
        const fresh = await evaluationsApi.getEvaluation(evaluation.id)
        setReportStatus(fresh.report_status)
        setReportError(fresh.report_error ?? null)
        setSentAt(fresh.report_email_sent_at ?? null)
        setSentTo(fresh.report_email_sent_to ?? null)
        if (fresh.report_status) {
          onPatch(evaluation.id, {
            report_status: fresh.report_status,
            report_error: fresh.report_error ?? null,
            report_email_sent_at: fresh.report_email_sent_at ?? null,
            report_email_sent_to: fresh.report_email_sent_to ?? null,
          })
        }
        return fresh
      } catch {
        if (!silent) toastError('No se pudo actualizar el estado del informe.')
        return null
      }
    },
    [evaluation.id, onPatch],
  )

  useEffect(() => {
    if (!open || reportStatus !== 'generating') return
    const timer = window.setInterval(() => void syncFromServer(true), REPORT_STATUS_POLL_MS)
    return () => window.clearInterval(timer)
  }, [open, reportStatus, syncFromServer])

  useEffect(() => {
    if (!open || reportStatus !== 'ready' || sentAt) return
    setLoadingRecipients(true)
    evaluationsApi
      .getReportRecipients(evaluation.id)
      .then(setRecipients)
      .catch(() => toastError('No se pudieron cargar los destinatarios.'))
      .finally(() => setLoadingRecipients(false))
  }, [open, reportStatus, sentAt, evaluation.id])

  const handleRetry = useCallback(async () => {
    if (retrying) return
    setRetrying(true)
    try {
      const fresh = await evaluationsApi.regenerateReport(evaluation.id)
      setReportStatus(fresh.report_status)
      setReportError(fresh.report_error ?? null)
      onPatch(evaluation.id, {
        report_status: fresh.report_status,
        report_error: fresh.report_error ?? null,
      })
      toastSuccess('Regeneración de informe iniciada.')
    } catch {
      toastError('No se pudo reintentar la generación del informe.')
    } finally {
      setRetrying(false)
    }
  }, [evaluation.id, onPatch, retrying])

  const handleSend = useCallback(() => {
    if (sending || sentAt) return
    setSending(true)
    void evaluationsApi
      .sendReport(evaluation.id)
      .then((result) => {
        setSentAt(result.sent_at)
        setSentTo(result.sent_to)
        onPatch(evaluation.id, {
          report_email_sent_at: result.sent_at,
          report_email_sent_to: result.sent_to,
        })
        toastSuccess(`Informe enviado a ${result.sent_to.length} destinatario(s).`)
      })
      .catch(() => toastError('No se pudo enviar el informe por correo.'))
      .finally(() => setSending(false))
  }, [evaluation.id, onPatch, sending, sentAt])

  return {
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
  }
}
