import { ControlCardMeta } from '@/components/shared/ControlCardMeta'
import { CheckSmIcon, XIcon } from '@/components/ui/Icons'
import { RESPONSE_OBSERVATIONS_MAX_LENGTH } from '@/lib/constants'
import { type Control } from '@/types/controls'
import { type ResponseState } from '../hooks/useQuestionnaire'
import { EvidenceUpload } from './EvidenceUpload'

interface ControlCardProps {
  control: Control
  response: ResponseState
  onVerdictChange: (complies: boolean) => void
  onObservationsChange: (text: string) => void
  onUploadEvidence: (files: File[]) => Promise<void>
  onDeleteEvidence: (evidenceId: string) => Promise<void>
}

export function ControlCard({
  control,
  response,
  onVerdictChange,
  onObservationsChange,
  onUploadEvidence,
  onDeleteEvidence,
}: ControlCardProps) {
  const { complies, observations, evidence } = response

  return (
    <div className="rounded-[12px] border border-border bg-white p-6 shadow-[0px_2px_6px_rgba(26,26,46,0.05)]">
      <ControlCardMeta control={control} />

      {/* Verdict buttons */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => onVerdictChange(true)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border py-[11px] text-[14px] font-medium transition-colors ${
            complies === true
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-border bg-surface-bg text-[#5a5a70] hover:bg-surface-alt'
          }`}
        >
          <CheckSmIcon />
          Sí, cumple
        </button>

        <button
          onClick={() => onVerdictChange(false)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border py-[11px] text-[14px] font-medium transition-colors ${
            complies === false
              ? 'border-red-300 bg-red-50 text-red-600'
              : 'border-border bg-surface-bg text-[#5a5a70] hover:bg-surface-alt'
          }`}
        >
          <XIcon />
          No cumple
        </button>
      </div>

      {/* Evidence upload — only when complies === true */}
      {complies === true && (
        <EvidenceUpload
          evidence={evidence}
          onUpload={onUploadEvidence}
          onDelete={onDeleteEvidence}
        />
      )}

      {/* Observations */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-[12px] font-medium text-[#44445a]">
            Observaciones{' '}
            <span className="font-light text-text-muted">(opcional)</span>
          </label>
          <span
            className={`text-[11px] tabular-nums ${observations.length >= RESPONSE_OBSERVATIONS_MAX_LENGTH ? 'text-red-500' : 'text-text-muted'}`}
          >
            {observations.length} / {RESPONSE_OBSERVATIONS_MAX_LENGTH}
          </span>
        </div>
        <textarea
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Notas adicionales, contexto o aclaraciones…"
          maxLength={RESPONSE_OBSERVATIONS_MAX_LENGTH}
          rows={3}
          className="w-full resize-none rounded-[7px] border border-border bg-surface-bg px-[13.4px] py-[9.4px] text-[13.2px] font-light text-text-primary placeholder:text-text-primary/50 transition-colors focus:border-primary focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  )
}
