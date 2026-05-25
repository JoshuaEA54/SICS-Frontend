import { getVerdictDisplayStyle, getVerdictLabel } from '@/features/evaluations/verdictDisplay'
import { type ResponseVerdict } from '@/types/evaluation'

interface VerdictBadgeProps {
  verdict: ResponseVerdict
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const style = getVerdictDisplayStyle(verdict)

  return (
    <span
      className={`inline-flex items-center rounded-[8px] border px-3 py-1.5 text-[13px] font-medium ${style.borderClass} ${style.bgClass} ${style.textClass}`}
    >
      {getVerdictLabel(verdict)}
    </span>
  )
}
