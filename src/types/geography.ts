export interface Province {
  id: number
  name: string
}

export interface Canton {
  id: number
  name: string
  province_id: number
}

export interface District {
  id: number
  name: string
  canton_id: number
}
