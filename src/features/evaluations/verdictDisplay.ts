/** Pure utilities for expert verdict labels and UI styling. */

import { type ResponseVerdict } from '@/types/evaluation'

export const EXPERT_VERDICT_OPTIONS = [
  { value: 'complies' as const, label: 'Cumple' },
  { value: 'complies_with_observations' as const, label: 'Cumple con observaciones' },
  { value: 'does_not_comply' as const, label: 'No cumple' },
] as const satisfies ReadonlyArray<{ value: ResponseVerdict; label: string }>

export interface VerdictDisplayStyle {
  textClass: string
  bgClass: string
  borderClass: string
  iconClass: string
}

const VERDICT_DISPLAY_STYLES: Record<ResponseVerdict, VerdictDisplayStyle> = {
  complies: {
    textClass: 'text-teal-dark',
    bgClass: 'bg-teal-light',
    borderClass: 'border-teal-border',
    iconClass: 'border-teal-border bg-teal-muted text-teal-dark',
  },
  complies_with_observations: {
    textClass: 'text-amber-dark',
    bgClass: 'bg-amber-light',
    borderClass: 'border-amber-border',
    iconClass: 'border-amber-border bg-amber-light text-amber-dark',
  },
  does_not_comply: {
    textClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-300',
    iconClass: 'border-red-300 bg-red-100 text-red-600',
  },
}

export function getVerdictDisplayStyle(verdict: ResponseVerdict): VerdictDisplayStyle {
  return VERDICT_DISPLAY_STYLES[verdict]
}

export function getVerdictSelectorButtonClasses(
  verdict: ResponseVerdict,
  selected: boolean,
): { button: string; icon: string } {
  if (verdict === 'complies') {
    return selected
      ? {
          button:
            'border-2 border-teal-border bg-teal-light text-teal-dark shadow-[0_0_0_2px_rgba(13,148,136,0.12)]',
          icon: 'border-teal-border bg-teal-muted text-teal-dark',
        }
      : {
          button:
            'border border-teal-border bg-white text-teal-dark hover:bg-teal-light',
          icon:
            'border-border bg-white text-text-muted group-hover:border-teal-border group-hover:bg-teal-muted group-hover:text-teal-dark',
        }
  }

  if (verdict === 'complies_with_observations') {
    return selected
      ? {
          button:
            'border-2 border-amber-border bg-amber-light text-amber-dark shadow-[0_0_0_2px_rgba(245,158,11,0.12)]',
          icon: 'border-amber-border bg-amber-light text-amber-dark',
        }
      : {
          button:
            'border border-amber-border bg-white text-amber-dark hover:bg-amber-light',
          icon:
            'border-border bg-white text-text-muted group-hover:border-amber-border group-hover:bg-amber-light group-hover:text-amber-dark',
        }
  }

  return selected
    ? {
        button:
          'border-2 border-red-300 bg-red-50 text-red-700 shadow-[0_0_0_2px_rgba(248,113,113,0.12)]',
        icon: 'border-red-300 bg-red-100 text-red-600',
      }
    : {
        button:
          'border border-red-300 bg-white text-red-700 hover:bg-red-50',
        icon:
          'border-border bg-white text-text-muted group-hover:border-red-300 group-hover:bg-red-100 group-hover:text-red-600',
      }
}

export function getVerdictLabel(verdict: ResponseVerdict): string {
  return EXPERT_VERDICT_OPTIONS.find((o) => o.value === verdict)?.label ?? verdict
}
