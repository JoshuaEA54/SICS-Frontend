export interface Sector {
  id: number
  name: string
}

export interface EmployeeRange {
  id: number
  label: string
}

export interface Contact {
  id: number
  name: string
  email: string
  position: string
}

export interface Company {
  id: number
  name: string
  sector_id: number
  sector?: Sector
  employee_range_id: number
  employee_range?: EmployeeRange
  district_id: number
  has_branches: boolean
  branch_count?: number
  contacts: Contact[]
}

export interface CompanyCreateStep1 {
  name: string
  sector_id: string
  employee_range_id?: string
  district_id: number
  has_branches: boolean
  branch_count?: number
}

export interface CompanyCreateStep2 {
  responsible_name: string
  responsible_position: string
  contacts: Omit<Contact, 'id'>[]
}

import { z } from 'zod'

export const registerStep1Schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    sector_id: z.string().min(1, 'Seleccione un sector'),
    employee_range_id: z.string().optional(),
    province_id: z.string().min(1, 'Seleccione una provincia'),
    canton_id: z.string().min(1, 'Seleccione un cantón'),
    district_id: z.string().min(1, 'Seleccione un distrito'),
    has_branches: z.enum(['true', 'false']),
    branch_count: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.has_branches === 'true' && !data.branch_count) {
      ctx.addIssue({ code: 'custom', message: 'Ingrese el número de sucursales', path: ['branch_count'] })
    }
  })

export type RegisterStep1FormValues = z.infer<typeof registerStep1Schema>
