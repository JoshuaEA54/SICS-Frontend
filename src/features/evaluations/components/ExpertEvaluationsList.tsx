import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EvaluationBadge } from '@/components/ui/Badge'
import { useExpertEvaluations } from '@/features/evaluations/hooks/useExpertEvaluations'
import { type EvaluationSummary } from '@/types/evaluation'
import { formatDate } from '@/lib/utils'

function EvaluationCard({ evaluation }: { evaluation: EvaluationSummary }) {
  const formatted = formatDate(evaluation.submitted_at ?? evaluation.created_at)

  return (
    <Card className="p-5 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-display font-semibold text-text-primary truncate">
          {evaluation.company_name ?? evaluation.company_id}
        </p>
        <p className="text-sm text-text-secondary">Enviada el {formatted}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <EvaluationBadge status={evaluation.status} />
        <Button variant="secondary" size="sm" disabled>
          Revisar
        </Button>
      </div>
    </Card>
  )
}

export function ExpertEvaluationsList() {
  const { pending, reviewed, loading, error } = useExpertEvaluations()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-text-secondary">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
          Pendientes de revisión
          {pending.length > 0 && (
            <span className="ml-2 text-sm font-sans font-normal text-text-secondary">
              ({pending.length})
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">
            No hay evaluaciones pendientes de revisión.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((e) => (
              <EvaluationCard key={e.id} evaluation={e} />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
            Revisadas
            <span className="ml-2 text-sm font-sans font-normal text-text-secondary">
              ({reviewed.length})
            </span>
          </h2>
          <div className="flex flex-col gap-3">
            {reviewed.map((e) => (
              <EvaluationCard key={e.id} evaluation={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
