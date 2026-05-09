import { EvaluationBadge } from '@/components/ui/Badge'
import { ClockIcon } from '@/components/ui/Icons'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface SubmittedCardProps {
  evaluation: EvaluationSummary
  num: number
}

export function SubmittedCard({ evaluation, num }: SubmittedCardProps) {
  return (
    <div className="rounded-xl border border-amber/40 bg-[#fffbeb] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text-muted">
              Evaluación #{num}
            </span>
            <EvaluationBadge status="submitted" />
          </div>

          <div>
            <h2 className="font-display text-[20px] font-semibold text-text-primary">
              Pendiente de revisión por el experto
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              Enviado el {formatDate(evaluation.submitted_at ?? evaluation.created_at)}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
          <ClockIcon size={22} />
        </div>
      </div>

      <div className="mt-4">
        <InfoBanner variant="amber">
          El experto está analizando los resultados de su evaluación. Recibirá una notificación
          por correo cuando el informe esté listo.
        </InfoBanner>
      </div>
    </div>
  )
}
