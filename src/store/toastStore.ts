import { create } from 'zustand'

type ToastVariant = 'error' | 'success' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
  autoDismiss: boolean
  duration: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((s) => ({ toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }] })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

const { addToast } = useToastStore.getState()

export const toastError = (message: string) =>
  addToast({ message, variant: 'error', autoDismiss: false, duration: 0 })

export const toastSuccess = (message: string) =>
  addToast({ message, variant: 'success', autoDismiss: true, duration: 4000 })

export const toastInfo = (message: string) =>
  addToast({ message, variant: 'info', autoDismiss: true, duration: 4000 })
