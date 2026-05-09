import { z } from 'zod'

// ── API read types ─────────────────────────────────────────────────────────────

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
  job_title?: string
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

// ── API write types ────────────────────────────────────────────────────────────

export interface CompanyCreate {
  name: string
  sector_id: number
  employee_range_id: number
  district_id: number
  branch_count: number
}

export interface ContactCreate {
  name: string
  email: string
  job_title?: string
}

// ── Form schemas & types ───────────────────────────────────────────────────────

export const registerStep1Schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
    sector_id: z.string().min(1, 'Seleccione un sector'),
    employee_range_id: z.string().min(1, 'Seleccione un rango de empleados'),
    province_id: z.string().min(1, 'Seleccione una provincia'),
    canton_id: z.string().min(1, 'Seleccione un cantón'),
    district_id: z.string().min(1, 'Seleccione un distrito'),
    has_branches: z.enum(['true', 'false']),
    branch_count: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.has_branches === 'true') {
      const n = Number(data.branch_count)
      if (!data.branch_count || isNaN(n) || n < 1) {
        ctx.addIssue({ code: 'custom', message: 'Ingrese un número de sucursales válido (mínimo 1)', path: ['branch_count'] })
      }
    }
  })

export type RegisterStep1FormValues = z.infer<typeof registerStep1Schema>

export const registerStep2Schema = z.object({
  responsible_name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  responsible_position: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
})

export type RegisterStep2FormValues = z.infer<typeof registerStep2Schema>
