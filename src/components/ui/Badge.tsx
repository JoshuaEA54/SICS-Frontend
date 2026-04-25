import { type ReactNode } from 'react'
import { type EvaluationStatus } from '@/types/evaluation'

type BadgeVariant = EvaluationStatus | 'neutral'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  draft: 'bg-surface-alt border border-border text-text-muted',
  submitted: 'bg-amber-light border border-amber-border text-amber-dark',
  reviewed: 'bg-teal-light border border-teal-border text-teal-dark',
  neutral: 'bg-surface-alt border border-border text-text-secondary',
}

const dots: Record<BadgeVariant, string> = {
  draft: 'bg-text-muted',
  submitted: 'bg-amber',
  reviewed: 'bg-teal',
  neutral: 'bg-text-muted',
}

const labels: Record<BadgeVariant, string> = {
  draft: 'Borrador',
  submitted: 'En revisión',
  reviewed: 'Revisada',
  neutral: '',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${variants[variant]} ${className}`}
    >
      <span className={`size-1.5 rounded-sm ${dots[variant]}`} />
      {children}
    </span>
  )
}

export function EvaluationBadge({ status }: { status: EvaluationStatus }) {
  return <Badge variant={status}>{labels[status]}</Badge>
}
