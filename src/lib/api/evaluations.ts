import { apiClient } from './client'
import { type Evaluation, type EvaluationSummary, type Response } from '@/types/evaluation'

export const evaluationsApi = {
  getMyEvaluations: () =>
    apiClient.get<EvaluationSummary[]>('/evaluations').then((r) => r.data),

  getEvaluation: (id: number) =>
    apiClient.get<Evaluation>(`/evaluations/${id}`).then((r) => r.data),

  createEvaluation: (companyId: string) =>
    apiClient.post<Evaluation>('/evaluations/', { company_id: companyId }).then((r) => r.data),

  saveResponse: (
    evaluationId: number,
    controlId: number,
    data: { complies: boolean; observations: string },
  ) =>
    apiClient
      .put<Response>(`/evaluations/${evaluationId}/responses/${controlId}`, data)
      .then((r) => r.data),

  submitEvaluation: (id: number) =>
    apiClient.patch<Evaluation>(`/evaluations/${id}/submit`).then((r) => r.data),

  uploadEvidence: (evaluationId: number, controlId: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post(`/evaluations/${evaluationId}/responses/${controlId}/evidence`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
