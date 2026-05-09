import { apiClient } from './client'
import { type ControlGroup } from '@/types/controls'

export const controlsApi = {
  getGroupsFull: () =>
    apiClient.get<ControlGroup[]>('/controls/groups/full').then((r) => r.data),
}
