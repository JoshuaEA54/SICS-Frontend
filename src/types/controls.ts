export interface Standard {
  id: number
  name: string
}

export interface ControlStandardRef {
  standard_name: string
  clause: string
}

export interface Control {
  id: string
  name: string
  description: string | null
  group_id?: string
  standards: ControlStandardRef[]
}

export interface ControlGroup {
  id: string
  name: string
  description: string | null
  controls: Control[]
}
