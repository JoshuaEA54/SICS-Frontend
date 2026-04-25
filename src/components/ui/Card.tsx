import { type HTMLAttributes, type ReactNode } from 'react'

type CardShadow = 'sm' | 'md' | 'lg' | 'none'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: CardShadow
  children: ReactNode
}

const shadows: Record<CardShadow, string> = {
  none: '',
  sm: 'shadow-[0px_1px_3px_rgba(26,26,46,0.04)]',
  md: 'shadow-card',
  lg: 'shadow-card-md',
}

export function Card({
  shadow = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${shadows[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
