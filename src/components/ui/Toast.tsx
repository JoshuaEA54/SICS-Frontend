import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToastStore } from '@/store/toastStore'

interface ToastProps {
  id: string
  message: string
  variant: 'error' | 'success' | 'info'
  autoDismiss: boolean
  duration: number
}

const STYLES: Record<ToastProps['variant'], string> = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-teal-light border-teal-border text-teal-dark',
  info: 'bg-primary-light border-primary-muted text-primary',
}

const ICONS: Record<ToastProps['variant'], JSX.Element> = {
  error: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[1px] shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v3.5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[1px] shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[1px] shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v3.5M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

export function Toast({ id, message, variant, autoDismiss, duration }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    if (!autoDismiss) return
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, autoDismiss, duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      className={`flex w-[320px] items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] font-medium shadow-card-md ${STYLES[variant]}`}
    >
      {ICONS[variant]}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        type="button"
        onClick={() => removeToast(id)}
        aria-label="Cerrar notificación"
        className="mt-[1px] shrink-0 opacity-50 transition-opacity hover:opacity-90"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  )
}
