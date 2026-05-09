import { type Control } from '@/types/controls'
import { type ResponseState } from '../hooks/useQuestionnaire'
import { EvidenceUpload } from './EvidenceUpload'
import { CheckSmIcon, XIcon } from '@/components/ui/Icons'

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
      {/* Header: code tag + title */}
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 rounded-[5px] border border-[#99f6e4] bg-[#ccfbf1] px-[7.8px] py-[4.5px] font-['Inter',sans-serif] text-[9.7px] font-bold tracking-[0.346px] text-[#0f766e]">
          {control.id}
        </span>
        <h2 className="font-display text-[16.8px] tracking-[-0.168px] text-text-primary">
          {control.name}
        </h2>
      </div>

      {/* Description */}
      <p className="mb-3 text-[13.7px] font-light leading-[1.6] text-[#5a5a70]">
        {control.description}
      </p>

      {/* Standard tags */}
      {control.standards.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {control.standards.map((ref) => (
            <span
              key={`${ref.standard_name}-${ref.clause}`}
              className="rounded-[4px] border border-border bg-[#f5f3ef] px-[6.8px] py-[3px] text-[10.7px] tracking-[0.107px] text-text-secondary"
            >
              {ref.standard_name} · {ref.clause}
            </span>
          ))}
        </div>
      )}

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
          <span className={`text-[11px] tabular-nums ${observations.length >= 500 ? 'text-red-500' : 'text-text-muted'}`}>
            {observations.length} / 500
          </span>
        </div>
        <textarea
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Notas adicionales, contexto o aclaraciones…"
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-[7px] border border-border bg-surface-bg px-[13.4px] py-[9.4px] text-[13.2px] font-light text-text-primary placeholder:text-text-primary/50 transition-colors focus:border-primary focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  )
}
