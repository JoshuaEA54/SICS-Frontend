import { type ReactNode } from 'react'
import {
  EXPERT_VERDICT_OPTIONS,
  getVerdictSelectorButtonClasses,
} from '@/features/evaluations/verdictDisplay'
import { CheckSmIcon, InfoIcon, XIcon } from '@/components/ui/Icons'
import { type ResponseVerdict } from '@/types/evaluation'

interface ExpertVerdictSelectorProps {
  value: ResponseVerdict | null
  onChange: (verdict: ResponseVerdict) => void
}

const VERDICT_ICONS: Record<ResponseVerdict, ReactNode> = {
  complies: <CheckSmIcon />,
  complies_with_observations: <InfoIcon />,
  does_not_comply: <XIcon />,
}

export function ExpertVerdictSelector({
  value,
  onChange,
}: ExpertVerdictSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Veredicto del experto"
      className="flex flex-wrap gap-2"
    >
      {EXPERT_VERDICT_OPTIONS.map((opt) => {
        const selected = value === opt.value
        const styles = getVerdictSelectorButtonClasses(opt.value, selected)

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`group flex min-w-0 flex-1 basis-[calc(33.333%-0.5rem)] items-center justify-center gap-2 rounded-[8px] px-3 py-2.5 transition-all ${styles.button}`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3 ${styles.icon}`}
            >
              {VERDICT_ICONS[opt.value]}
            </span>
            <span className="text-[13px] font-medium leading-tight">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
