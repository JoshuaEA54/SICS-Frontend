import { type ReportStatusPatch } from '@/features/evaluations/hooks/useReportStatusPolling'
import { type EvaluationSummary, type ReportStatus } from '@/types/evaluation'

export function applyEvaluationPatch(
  evaluation: EvaluationSummary,
  patch: ReportStatusPatch | undefined,
): EvaluationSummary {
  if (!patch) return evaluation
  return {
    ...evaluation,
    ...(patch.report_status !== undefined ? { report_status: patch.report_status } : {}),
    ...(patch.report_error !== undefined ? { report_error: patch.report_error } : {}),
    ...(patch.report_email_sent_at !== undefined
      ? { report_email_sent_at: patch.report_email_sent_at }
      : {}),
    ...(patch.report_email_sent_to !== undefined
      ? { report_email_sent_to: patch.report_email_sent_to }
      : {}),
  }
}

export function reportStatusOverrides(
  patches: Record<string, ReportStatusPatch>,
): Record<string, ReportStatus> {
  const overrides: Record<string, ReportStatus> = {}
  for (const [id, patch] of Object.entries(patches)) {
    if (patch.report_status) {
      overrides[id] = patch.report_status
    }
  }
  return overrides
}
