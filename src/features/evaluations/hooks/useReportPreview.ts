import { useCallback, useRef, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { downloadBlob } from '@/lib/evidence'
import { buildReportDownloadFilename } from '@/features/evaluations/complianceDisplay'
import { toastError } from '@/store/toastStore'
import { type EvaluationSummary } from '@/types/evaluation'

export function useReportPreview() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeEvaluation, setActiveEvaluation] = useState<EvaluationSummary | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const cachedBlobRef = useRef<Blob | null>(null)

  const closeReport = useCallback(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
    }
    setBlobUrl(null)
    setOpen(false)
    setActiveEvaluation(null)
    setLoading(false)
    cachedBlobRef.current = null
  }, [blobUrl])

  const openReport = useCallback(async (evaluation: EvaluationSummary) => {
    setActiveEvaluation(evaluation)
    setOpen(true)
    setLoading(true)
    setBlobUrl(null)
    cachedBlobRef.current = null

    try {
      const blob = await evaluationsApi.fetchReportBlob(evaluation.id)
      cachedBlobRef.current = blob
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
    } catch {
      toastError('No se pudo cargar el informe.')
      setOpen(false)
      setActiveEvaluation(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadReport = useCallback(async () => {
    if (!activeEvaluation) return
    try {
      const blob =
        cachedBlobRef.current ?? (await evaluationsApi.fetchReportBlob(activeEvaluation.id))
      const filename = buildReportDownloadFilename(
        activeEvaluation.company_name ?? activeEvaluation.company_id,
        activeEvaluation.reviewed_at,
      )
      downloadBlob(blob, filename)
    } catch {
      toastError('No se pudo descargar el informe.')
    }
  }, [activeEvaluation])

  return {
    reportOpen: open,
    reportLoading: loading,
    reportBlobUrl: blobUrl,
    activeReportEvaluation: activeEvaluation,
    openReport,
    closeReport,
    downloadReport,
  }
}
