import { apiClient } from './client'
import { type Evaluation, type EvaluationStatus, type EvaluationSummary, type Response, type Evidence } from '@/types/evaluation'
import { type PaginatedResponse } from '@/types/api'

export const evaluationsApi = {
  getEvaluations: (params?: { status?: EvaluationStatus; company_id?: string }) =>
    apiClient
      .get<PaginatedResponse<EvaluationSummary>>('/evaluations/', { params })
      .then((r) => r.data.items),

  getDraftEvaluation: () =>
    apiClient.get<Evaluation | null>('/evaluations/draft').then((r) => r.data),

  getEvaluation: (id: string) =>
    apiClient.get<Evaluation>(`/evaluations/${id}`).then((r) => r.data),

  getResponses: (evaluationId: string) =>
    apiClient
      .get<PaginatedResponse<Response>>(`/evaluations/${evaluationId}/responses`, {
        params: { size: 100 },
      })
      .then((r) => r.data.items),

  createEvaluation: (companyId: string) =>
    apiClient.post<Evaluation>('/evaluations/', { company_id: companyId }).then((r) => r.data),

  saveResponse: (
    evaluationId: string,
    controlId: string,
    data: { complies: boolean; observations: string },
  ) =>
    apiClient
      .put<Response>(`/evaluations/${evaluationId}/responses`, {
        control_id: controlId,
        answer: data.complies,
        observations: data.observations || null,
      })
      .then((r) => r.data),

  submitEvaluation: (id: string) =>
    apiClient
      .patch<Evaluation>(`/evaluations/${id}/status`, { status: 'submitted' })
      .then((r) => r.data),

  uploadEvidence: (responseId: string, files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return apiClient
      .post<Evidence[]>(`/evaluations/responses/${responseId}/evidence`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  getEvidenceForResponse: (responseId: string) =>
    apiClient
      .get<PaginatedResponse<Evidence>>(`/evaluations/responses/${responseId}/evidence`, {
        params: { size: 100 },
      })
      .then((r) => r.data.items),

  deleteEvidence: (evidenceId: string) =>
    apiClient.delete(`/evaluations/evidence/${evidenceId}`),
}
