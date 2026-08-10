import { type ReactNode, useId } from 'react'
import { XIcon } from '@/components/ui/Icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

export function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  const titleId = useId()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className={`w-full ${maxWidth} rounded-xl border border-border bg-surface p-6 shadow-lg`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={titleId} className="font-display text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary"
            aria-label="Cerrar"
          >
            <XIcon />
          </button>
        </div>

        {children}

        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
