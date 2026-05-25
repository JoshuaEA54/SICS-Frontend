import { getVerdictLabel, requiresExpertVerdict } from '@/features/evaluations/expertReview'
import { ExpertVerdictSelector } from '@/features/evaluations/components/ExpertVerdictSelector'
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
      <div className="rounded-[8px] border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Veredicto del experto</p>
        <p className="mt-1 text-[14px] font-medium text-primary">
          {response.verdict ? getVerdictLabel(response.verdict) : '—'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[8px] border border-primary/15 bg-[#f8faff] px-3 py-2.5">
      <p className="mb-2 text-[12px] font-medium text-text-primary">
        Emita su veredicto <span className="text-primary">*</span>
      </p>
      <ExpertVerdictSelector
        value={response.verdict}
        onChange={(verdict) => onVerdictChange(response.id, verdict)}
      />
    </div>
  )
}
