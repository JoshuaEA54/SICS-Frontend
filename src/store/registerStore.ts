import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompanyCreateStep1 } from '@/types/company'

interface RegisterStore {
  step1: CompanyCreateStep1 | null
  setStep1: (data: CompanyCreateStep1) => void
  clear: () => void
}

export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set) => ({
      step1: null,
      setStep1: (data) => set({ step1: data }),
      clear: () => set({ step1: null }),
    }),
    { name: 'sics-register' },
  ),
)
