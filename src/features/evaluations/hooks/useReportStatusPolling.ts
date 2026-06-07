import { useEffect } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { REPORT_STATUS_POLL_MS } from '@/lib/constants'
import { type EvaluationSummary, type ReportStatus } from '@/types/evaluation'

export interface ReportStatusPatch {
  report_status?: ReportStatus | null
  report_error?: string | null
  report_email_sent_at?: string | null
  report_email_sent_to?: string[] | null
}

interface UseReportStatusPollingOptions {
  evaluations: EvaluationSummary[]
  statusOverrides: Record<string, ReportStatus>
  onPatch: (id: string, patch: ReportStatusPatch) => void
  enabled?: boolean
}

function effectiveStatus(
  evaluation: EvaluationSummary,
  statusOverrides: Record<string, ReportStatus>,
): ReportStatus | null | undefined {
  return statusOverrides[evaluation.id] ?? evaluation.report_status
}

export function useReportStatusPolling({
  evaluations,
  statusOverrides,
  onPatch,
  enabled = true,
}: UseReportStatusPollingOptions) {
  useEffect(() => {
    if (!enabled) return

    const generatingIds = evaluations
      .filter((item) => effectiveStatus(item, statusOverrides) === 'generating')
      .map((item) => item.id)

    if (generatingIds.length === 0) return

    let cancelled = false

    const poll = async () => {
      await Promise.all(
        generatingIds.map(async (id) => {
          try {
            const fresh = await evaluationsApi.getEvaluation(id)
            if (cancelled) return
            if (fresh.report_status && fresh.report_status !== 'generating') {
              onPatch(id, {
                report_status: fresh.report_status,
                report_error: fresh.report_error ?? null,
                report_email_sent_at: fresh.report_email_sent_at ?? null,
                report_email_sent_to: fresh.report_email_sent_to ?? null,
              })
            }
          } catch {
            // ignore transient poll errors
          }
        }),
      )
    }

    void poll()
    const timer = window.setInterval(() => void poll(), REPORT_STATUS_POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [evaluations, statusOverrides, onPatch, enabled])
}
