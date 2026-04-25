import { apiClient } from './client'
import { type Province, type Canton, type District } from '@/types/geography'

export const geographyApi = {
  getProvinces: () =>
    apiClient.get<Province[]>('/geography/provinces').then((r) => r.data),

  getCantons: (provinceId: number) =>
    apiClient
      .get<Canton[]>(`/geography/provinces/${provinceId}/cantons`)
      .then((r) => r.data),

  getDistricts: (cantonId: number) =>
    apiClient
      .get<District[]>(`/geography/cantons/${cantonId}/districts`)
      .then((r) => r.data),
}
