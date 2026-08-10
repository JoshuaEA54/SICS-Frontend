import { apiClient } from './client'
import { type PaginatedResponse } from '@/types/api'
import {
  type ControlGroup,
  type ControlGroupCreate,
  type ControlGroupRead,
  type ControlGroupUpdate,
} from '@/types/controls'

export const controlsApi = {
  getGroupsFull: () =>
    apiClient.get<ControlGroup[]>('/controls/groups/full').then((r) => r.data),

  listGroups: (params?: { q?: string; page?: number; size?: number }) =>
    apiClient
      .get<PaginatedResponse<ControlGroupRead>>('/controls/groups', { params })
      .then((r) => r.data),

  createGroup: (data: ControlGroupCreate) =>
    apiClient.post<ControlGroupRead>('/controls/groups', data).then((r) => r.data),

  updateGroup: (id: string, data: ControlGroupUpdate) =>
    apiClient.put<ControlGroupRead>(`/controls/groups/${id}`, data).then((r) => r.data),

  deleteGroup: (id: string) =>
    apiClient.delete(`/controls/groups/${id}`).then(() => undefined),
}
