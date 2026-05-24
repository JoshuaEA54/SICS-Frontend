import { type ReviewProgress } from '@/types/evaluation'

interface ReviewProgressLabelProps {
  progress: ReviewProgress
  compact?: boolean
}

export function ReviewProgressLabel({ progress, compact = false }: ReviewProgressLabelProps) {
  const { completed, required } = progress

  if (compact) {
    return (
      <p className="text-sm text-text-secondary">
        {completed} de {required} veredictos emitidos
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-medium text-text-primary">
        {completed} de {required} veredictos emitidos
      </p>
      <p className="text-xs text-text-muted">
        Solo los controles que la empresa marcó «Sí cumple». Al abrir la evaluación puede consultar
        también los demás.
      </p>
    </div>
  )
}
