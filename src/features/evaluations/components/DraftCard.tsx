import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { formatDate } from '@/lib/utils'
import { type EvaluationSummary } from '@/types/evaluation'

interface DraftCardProps {
  evaluation: EvaluationSummary
}

export function DraftCard({ evaluation }: DraftCardProps) {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate(`/cuestionario/${evaluation.id}`)
  }

  return (
    <div className="rounded-[14px] border-2 border-dashed border-primary/30 bg-primary/[0.03] px-6 py-5">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <span className="text-[10.6px] font-bold uppercase tracking-[0.95px] text-primary/70">
            En progreso
          </span>

          <h2 className="font-display text-[18.4px] font-semibold leading-[22px] tracking-[-0.28px] text-text-primary">
            Evaluación en curso
          </h2>

          <p className="text-[12.8px] font-light leading-[19.2px] text-text-muted">
            Iniciada el {formatDate(evaluation.created_at)}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRightIcon />}
          onClick={handleContinue}
        >
          Continuar evaluación
        </Button>
      </div>
    </div>
  )
}
