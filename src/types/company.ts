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
  sector_id: number
  employee_range_id: number
  district_id: number
  has_branches: boolean
  branch_count?: number
}

export interface CompanyCreateStep2 {
  responsible_name: string
  responsible_position: string
  contacts: Omit<Contact, 'id'>[]
}
