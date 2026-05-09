import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Step1PersistedData {
  name: string;
  sector_id: string;
  employee_range_id: string;
  province_id: string;
  canton_id: string;
  district_id: string;
  has_branches: "true" | "false";
  branch_count: string;
}

interface RegisterStore {
  companyId: string | null;
  step1Data: Step1PersistedData | null;
  setCompanyId: (id: string) => void;
  setStep1Data: (data: Step1PersistedData) => void;
  clear: () => void;
}

export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set) => ({
      companyId: null,
      step1Data: null,
      setCompanyId: (id) => set({ companyId: id }),
      setStep1Data: (data) => set({ step1Data: data }),
      clear: () => set({ companyId: null, step1Data: null }),
    }),
    { name: "sics-register" },
  ),
);
