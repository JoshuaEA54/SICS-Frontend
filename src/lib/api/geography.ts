import { apiClient } from './client'
import { type Province, type Canton, type District } from '@/types/geography'

export const geographyApi = {
  getProvinces: () =>
    apiClient.get<{ items: Province[] }>('/geography/provinces').then((r) => r.data.items),

  getCantons: (provinceId: number) =>
    apiClient
      .get<{ items: Canton[] }>(`/geography/provinces/${provinceId}/cantons`)
      .then((r) => r.data.items),

  getDistricts: (cantonId: number) =>
    apiClient
      .get<{ items: District[] }>(`/geography/cantons/${cantonId}/districts`)
      .then((r) => r.data.items),
}
