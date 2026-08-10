import { type ControlCriticality } from '@/types/controls'

export const CRITICALITY_LABELS: Record<ControlCriticality, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

export const CRITICALITY_OPTIONS = (
  Object.entries(CRITICALITY_LABELS) as [ControlCriticality, string][]
).map(([value, label]) => ({ value, label }))

const CRITICALITY_CHIP_CLASSES: Record<ControlCriticality, string> = {
  high: 'bg-red-100 text-red-700 border border-red-300',
  medium: 'bg-amber-light text-amber-dark border border-amber-border',
  low: 'bg-teal-light text-teal-dark border border-teal-border',
}

export function criticalityChipClass(value: ControlCriticality | null): string {
  if (!value) return 'bg-surface-alt text-text-muted border border-border'
  return CRITICALITY_CHIP_CLASSES[value]
}
