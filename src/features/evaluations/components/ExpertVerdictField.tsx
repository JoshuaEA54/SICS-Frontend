import { ExpertObservationsField } from '@/features/evaluations/components/ExpertObservationsField'
import { ExpertVerdictSelector } from '@/features/evaluations/components/ExpertVerdictSelector'
import { VerdictBadge } from '@/features/evaluations/components/VerdictBadge'
import {
  requiresExpertVerdict,
  verdictRequiresExpertObservations,
} from '@/features/evaluations/expertReview'
import { type Response, type ResponseVerdict } from '@/types/evaluation'

interface ExpertVerdictFieldProps {
  response: Response
  readOnly: boolean
  displayVerdict: ResponseVerdict | null
  observationsValue: string
  onVerdictChange: (responseId: string, verdict: ResponseVerdict) => void
  onObservationsChange: (responseId: string, text: string) => void
  onObservationsBlur: (responseId: string) => void
}

export function ExpertVerdictField({
  response,
  readOnly,
  displayVerdict,
  observationsValue,
  onVerdictChange,
  onObservationsChange,
  onObservationsBlur,
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
        {response.expert_observations ? (
          <p className="mt-3 text-[13px] text-text-secondary whitespace-pre-wrap">
            {response.expert_observations}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="rounded-[8px] border border-border bg-surface-alt px-3 py-2.5">
      <p className="mb-2 text-[12px] font-medium text-text-primary">
        Emita su veredicto <span className="text-red-600">*</span>
      </p>
      <ExpertVerdictSelector
        value={displayVerdict}
        onChange={(verdict) => onVerdictChange(response.id, verdict)}
      />
      {verdictRequiresExpertObservations(displayVerdict) ? (
        <ExpertObservationsField
          value={observationsValue}
          onChange={(text) => onObservationsChange(response.id, text)}
          onBlur={() => onObservationsBlur(response.id)}
        />
      ) : displayVerdict === 'complies' ? (
        <p className="mt-2 text-[12px] text-text-muted">
          Este veredicto no requiere observaciones del experto.
        </p>
      ) : null}
    </div>
  )
}
