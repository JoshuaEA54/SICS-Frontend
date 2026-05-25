import { requiresExpertVerdict } from '@/features/evaluations/expertReview'
import { ExpertVerdictSelector } from '@/features/evaluations/components/ExpertVerdictSelector'
import { VerdictBadge } from '@/features/evaluations/components/VerdictBadge'
import { type Response, type ResponseVerdict } from '@/types/evaluation'

interface ExpertVerdictFieldProps {
  response: Response
  readOnly: boolean
  onVerdictChange: (responseId: string, verdict: ResponseVerdict) => void
}

export function ExpertVerdictField({
  response,
  readOnly,
  onVerdictChange,
}: ExpertVerdictFieldProps) {
  if (!requiresExpertVerdict(response)) {
    return (
      <p className="rounded-[8px] border border-border bg-surface-alt px-4 py-3 text-[13px] text-text-secondary">
        La empresa indicó que no cumple — no requiere veredicto del experto.
      </p>
    )
  }

  if (readOnly) {
    return (
      <div className="rounded-[8px] border border-border bg-surface-alt px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Veredicto del experto</p>
        <div className="mt-2">
          {response.verdict ? (
            <VerdictBadge verdict={response.verdict} />
          ) : (
            <span className="text-[14px] text-text-muted">—</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[8px] border border-border bg-surface-alt px-3 py-2.5">
      <p className="mb-2 text-[12px] font-medium text-text-primary">
        Emita su veredicto <span className="text-red-600">*</span>
      </p>
      <ExpertVerdictSelector
        value={response.verdict}
        onChange={(verdict) => onVerdictChange(response.id, verdict)}
      />
    </div>
  )
}
