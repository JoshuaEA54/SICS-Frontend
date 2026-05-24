import { type EvaluationStatus } from '@/types/evaluation'
import {
  DEFAULT_PAGE,
  EXPERT_EVALUATIONS_MAX_PAGE_SIZE,
  EXPERT_EVALUATIONS_PAGE_SIZE,
} from '@/lib/constants'

export type ExpertStatusFilter = EvaluationStatus | 'all'

export interface ExpertEvaluationFilters {
  company_id: string
  status: ExpertStatusFilter
  sector_id: string
  page: number
  size: number
}

export const DEFAULT_EXPERT_FILTERS: ExpertEvaluationFilters = {
  company_id: '',
  status: 'all',
  sector_id: '',
  page: DEFAULT_PAGE,
  size: EXPERT_EVALUATIONS_PAGE_SIZE,
}

export function filtersFromSearchParams(params: URLSearchParams): ExpertEvaluationFilters {
  const status = params.get('status')
  const validStatus: ExpertStatusFilter =
    status === 'submitted' || status === 'reviewed' ? status : 'all'

  const page = Math.max(DEFAULT_PAGE, Number(params.get('page') ?? DEFAULT_PAGE) || DEFAULT_PAGE)
  const size = Math.min(
    EXPERT_EVALUATIONS_MAX_PAGE_SIZE,
    Math.max(1, Number(params.get('size') ?? EXPERT_EVALUATIONS_PAGE_SIZE) || EXPERT_EVALUATIONS_PAGE_SIZE),
  )

  return {
    company_id: params.get('company_id') ?? '',
    status: validStatus,
    sector_id: params.get('sector_id') ?? '',
    page,
    size,
  }
}

export function filtersToSearchParams(filters: ExpertEvaluationFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.company_id) params.set('company_id', filters.company_id)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.sector_id) params.set('sector_id', filters.sector_id)
  if (filters.page !== DEFAULT_PAGE) params.set('page', String(filters.page))
  if (filters.size !== EXPERT_EVALUATIONS_PAGE_SIZE) params.set('size', String(filters.size))
  return params
}

export function filtersToApiParams(
  filters: ExpertEvaluationFilters,
  overrides?: { status?: EvaluationStatus; page?: number; size?: number },
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: overrides?.page ?? filters.page,
    size: overrides?.size ?? filters.size,
  }
  if (filters.company_id) params.company_id = filters.company_id
  const status = overrides?.status ?? (filters.status !== 'all' ? filters.status : undefined)
  if (status) params.status = status
  if (filters.sector_id) params.sector_id = Number(filters.sector_id)
  return params
}

export function hasActiveFilters(filters: ExpertEvaluationFilters): boolean {
  return filters.status !== 'all' || filters.company_id !== '' || filters.sector_id !== ''
}

export function countActiveFilters(filters: ExpertEvaluationFilters): number {
  let count = 0
  if (filters.status !== 'all') count++
  if (filters.company_id) count++
  if (filters.sector_id) count++
  return count
}

export function buildNextFilter<K extends keyof ExpertEvaluationFilters>(
  filters: ExpertEvaluationFilters,
  key: K,
  value: ExpertEvaluationFilters[K],
): ExpertEvaluationFilters {
  const next = { ...filters, [key]: value }
  if (key !== 'page') next.page = DEFAULT_PAGE
  if (key === 'company_id' && value) next.sector_id = ''
  if (key === 'sector_id' && value) next.company_id = ''
  return next
}

export function getPaginationRange(page: number, size: number, total: number) {
  return {
    rangeStart: total === 0 ? 0 : (page - 1) * size + 1,
    rangeEnd: Math.min(page * size, total),
  }
}
