import { apiClient } from './client'
import { type Company, type Sector, type EmployeeRange } from '@/types/company'

export const companiesApi = {
  getSectors: () =>
    apiClient.get<{ items: Sector[] }>('/companies/sectors').then((r) => r.data.items),

  getEmployeeRanges: () =>
    apiClient.get<{ items: EmployeeRange[] }>('/companies/employee-ranges').then((r) => r.data.items),

  getMyCompany: () =>
    apiClient.get<Company>('/companies/me').then((r) => r.data),

  createCompany: (data: Partial<Company>) =>
    apiClient.post<Company>('/companies', data).then((r) => r.data),

  updateCompany: (id: number, data: Partial<Company>) =>
    apiClient.put<Company>(`/companies/${id}`, data).then((r) => r.data),
}
