export type EvaluationStatus = 'draft' | 'submitted' | 'reviewed'

export type ResponseVerdict = 'complies' | 'complies_with_observations' | 'does_not_comply'

export interface Evidence {
  id: number
  filename: string
  uploaded_at: string
}

export interface Response {
  id: number
  control_id: number
  complies: boolean | null
  observations: string
  verdict?: ResponseVerdict
  evidence: Evidence[]
}

export interface Evaluation {
  id: number
  company_id: number
  status: EvaluationStatus
  created_at: string
  submitted_at?: string
  reviewed_at?: string
  last_group_id?: number
  responses: Response[]
  compliance_percentage?: number
  compliant_controls?: number
  total_controls?: number
  reviewed_by?: string
}

export interface EvaluationSummary {
  id: number
  status: EvaluationStatus
  created_at: string
  submitted_at?: string
  reviewed_at?: string
  compliance_percentage?: number
  compliant_controls?: number
  total_controls?: number
  reviewed_by?: string
}
