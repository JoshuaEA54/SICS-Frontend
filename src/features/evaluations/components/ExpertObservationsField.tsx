import { RESPONSE_OBSERVATIONS_MAX_LENGTH } from '@/lib/constants'

interface ExpertObservationsFieldProps {
  value: string
  onChange: (text: string) => void
  onBlur: () => void
}

export function ExpertObservationsField({
  value,
  onChange,
  onBlur,
}: ExpertObservationsFieldProps) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-[12px] font-medium text-text-primary">
          Observaciones del experto <span className="text-red-600">*</span>
        </label>
        <span
          className={`text-[11px] tabular-nums ${
            value.length >= RESPONSE_OBSERVATIONS_MAX_LENGTH ? 'text-red-500' : 'text-text-muted'
          }`}
        >
          {value.length} / {RESPONSE_OBSERVATIONS_MAX_LENGTH}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Describa las observaciones o el motivo del veredicto…"
        maxLength={RESPONSE_OBSERVATIONS_MAX_LENGTH}
        rows={3}
        className="w-full resize-none rounded-[7px] border border-border bg-white px-[13.4px] py-[9.4px] text-[13.2px] font-light text-text-primary placeholder:text-text-primary/50 transition-colors focus:border-primary focus:bg-white focus:outline-none"
      />
    </div>
  )
}
