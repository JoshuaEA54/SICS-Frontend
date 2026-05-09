import { apiClient } from "./client";
import { type TokenResponse } from "@/types/auth";
import {
  type Company,
  type Sector,
  type EmployeeRange,
  type CompanyCreate,
  type ContactCreate,
} from "@/types/company";

export const companiesApi = {
  getSectors: () =>
    apiClient
      .get<{ items: Sector[] }>("/companies/sectors")
      .then((r) => r.data.items),

  getEmployeeRanges: () =>
    apiClient
      .get<{ items: EmployeeRange[] }>("/companies/employee-ranges")
      .then((r) => r.data.items),

  getCompany: (id: string) =>
    apiClient.get<Company>(`/companies/${id}`).then((r) => r.data),

  create: (data: CompanyCreate) =>
    apiClient.post<TokenResponse>("/companies/", data).then((r) => r.data),

  updateCompany: (id: string, data: Partial<Company>) =>
    apiClient.put<Company>(`/companies/${id}`, data).then((r) => r.data),

  addContact: (companyId: string, data: ContactCreate) =>
    apiClient
      .post(`/companies/${companyId}/contacts`, data)
      .then((r) => r.data),
};
