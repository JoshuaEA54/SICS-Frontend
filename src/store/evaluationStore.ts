import { create } from 'zustand'
import { type EvaluationSummary } from '@/types/evaluation'

interface EvaluationStore {
  activeEvaluationId: number | null
  currentGroupId: number | null
  evaluations: EvaluationSummary[]
  setActiveEvaluation: (id: number) => void
  setCurrentGroup: (groupId: number) => void
  setEvaluations: (evaluations: EvaluationSummary[]) => void
  clearEvaluation: () => void
}

export const useEvaluationStore = create<EvaluationStore>()((set) => ({
  activeEvaluationId: null,
  currentGroupId: null,
  evaluations: [],
  setActiveEvaluation: (id) => set({ activeEvaluationId: id }),
  setCurrentGroup: (groupId) => set({ currentGroupId: groupId }),
  setEvaluations: (evaluations) => set({ evaluations }),
  clearEvaluation: () => set({ activeEvaluationId: null, currentGroupId: null }),
}))
