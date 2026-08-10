import { Textarea } from '@/components/ui/Textarea'
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
      <Textarea
        label="Observaciones del experto"
        required
        showCharCount
        maxLength={RESPONSE_OBSERVATIONS_MAX_LENGTH}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Describa las observaciones o el motivo del veredicto…"
      />
    </div>
  )
}
