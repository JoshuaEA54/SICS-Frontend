export interface Standard {
  id: number
  name: string
  short_name: string
}

export interface ControlStandardRef {
  standard: Standard
  clause: string
}

export interface Control {
  id: number
  code: string
  name: string
  description: string
  group_id: number
  standards: ControlStandardRef[]
}

export interface ControlGroup {
  id: number
  code: string
  name: string
  description: string
  controls: Control[]
}
