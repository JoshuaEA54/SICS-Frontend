import { EvaluationBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CalendarIcon, ArrowRightIcon } from '@/components/ui/Icons'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface ReviewedCardProps {
  evaluation: EvaluationSummary
  num: number
}

export function ReviewedCard({ evaluation, num }: ReviewedCardProps) {
  const dateLabel = evaluation.reviewed_at
    ? `Revisada el ${formatDate(evaluation.reviewed_at)}`
    : formatDate(evaluation.created_at)

  return (
    <div className="rounded-xl border border-primary/20 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text-muted">
              Evaluación #{num}
            </span>
            <EvaluationBadge status="reviewed" />
          </div>

          <div>
            <h2 className="font-display text-[20px] font-semibold text-text-primary">
              Evaluación completada
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">{dateLabel}</p>
          </div>

          <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
            <CalendarIcon />
            <span>Creada el {formatDate(evaluation.created_at)}</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button variant="secondary" size="sm" disabled>
            Ver informe
            <span className="ml-1.5">
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
