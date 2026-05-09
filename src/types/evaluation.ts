export type EvaluationStatus = 'draft' | 'submitted' | 'reviewed'

export type ResponseVerdict = 'complies' | 'complies_with_observations' | 'does_not_comply'

export interface Evidence {
  id: string
  response_id: string
  file_name: string
  file_type: string | null
  created_at: string
}

export interface Response {
  id: string
  evaluation_id: string
  control_id: string
  answer: boolean
  observations: string | null
  answered_at: string
  verdict: ResponseVerdict | null
}

export interface Evaluation {
  id: string
  company_id: string
  company_name?: string | null
  status: EvaluationStatus
  last_group_id?: string | null
  submitted_at?: string | null
  reviewed_at?: string | null
  created_at: string
}

export interface EvaluationSummary {
  id: string
  company_id: string
  company_name?: string
  status: EvaluationStatus
  created_at: string
  submitted_at?: string
  reviewed_at?: string
}
