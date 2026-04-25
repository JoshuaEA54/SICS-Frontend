import { apiClient } from './client'
import { type ControlGroup } from '@/types/controls'

export const controlsApi = {
  getGroups: () =>
    apiClient.get<ControlGroup[]>('/controls/groups').then((r) => r.data),

  getGroupWithControls: (groupId: number) =>
    apiClient.get<ControlGroup>(`/controls/groups/${groupId}`).then((r) => r.data),
}
