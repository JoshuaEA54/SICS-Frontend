import { type ControlGroup } from '@/types/controls'
import { type Evaluation, type Response, type ResponseVerdict, type ReviewProgress } from '@/types/evaluation'

const VERDICTS_REQUIRING_EXPERT_OBSERVATIONS = new Set<ResponseVerdict>([
  'complies_with_observations',
  'does_not_comply',
])

export interface ExpertReviewUi {
  getVerdict: (response: Response) => ResponseVerdict | null
  getObservations: (response: Response) => string
}

export interface ExpertVerdictDraftSource {
  getDisplayVerdict: (response: Response) => ResponseVerdict | null
  getObservationsValue: (response: Response) => string
}

export function buildExpertReviewUi(draft: ExpertVerdictDraftSource): ExpertReviewUi {
  return {
    getVerdict: draft.getDisplayVerdict,
    getObservations: draft.getObservationsValue,
  }
}

export function verdictRequiresExpertObservations(
  verdict: ResponseVerdict | null | undefined,
): boolean {
  return verdict != null && VERDICTS_REQUIRING_EXPERT_OBSERVATIONS.has(verdict)
}

export function requiresExpertVerdict(response: Response): boolean {
  return response.answer === true
}

export function isResponseReviewComplete(
  response: Response,
  ui?: ExpertReviewUi,
): boolean {
  if (!requiresExpertVerdict(response)) return true

  const verdict = ui ? ui.getVerdict(response) : response.verdict
  if (verdict === null) return false

  if (verdictRequiresExpertObservations(verdict)) {
    const observations = ui
      ? ui.getObservations(response)
      : (response.expert_observations ?? '')
    return Boolean(observations.trim())
  }

  return true
}

export function computeReviewProgress(
  responses: Response[],
  ui?: ExpertReviewUi,
): ReviewProgress {
  const required = responses.filter(requiresExpertVerdict)
  const completed = required.filter((r) => isResponseReviewComplete(r, ui))
  return { completed: completed.length, required: required.length }
}

export function countGroupVerdicts(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
  ui?: ExpertReviewUi,
): { completed: number; required: number } {
  let completed = 0
  let required = 0
  for (const control of group.controls) {
    const r = responsesByControlId[control.id]
    if (!r || !requiresExpertVerdict(r)) continue
    required += 1
    if (isResponseReviewComplete(r, ui)) completed += 1
  }
  return { completed, required }
}

export function countPendingVerdictsInGroup(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
  ui?: ExpertReviewUi,
): number {
  const { completed, required } = countGroupVerdicts(group, responsesByControlId, ui)
  return Math.max(required - completed, 0)
}

function hasAllGroupResponses(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): boolean {
  return group.controls.every((c) => responsesByControlId[c.id] !== undefined)
}

export function isGroupVerdictsComplete(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
  ui?: ExpertReviewUi,
): boolean {
  if (group.controls.length === 0) return false
  const { completed, required } = countGroupVerdicts(group, responsesByControlId, ui)
  return required > 0 && completed === required
}

export function isGroupReviewAdvanceable(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
  ui?: ExpertReviewUi,
): boolean {
  if (group.controls.length === 0) return false
  if (!hasAllGroupResponses(group, responsesByControlId)) return false
  return countPendingVerdictsInGroup(group, responsesByControlId, ui) === 0
}

export function canFinalizeEvaluation(
  evaluation: Evaluation | null,
  responses: Response[],
  ui?: ExpertReviewUi,
): boolean {
  if (!evaluation || evaluation.status !== 'submitted') return false
  const { completed, required } = computeReviewProgress(responses, ui)
  return required > 0 && completed === required
}

export function findActiveGroupIndex(
  groups: ControlGroup[],
  responsesByControlId: Record<string, Response | undefined>,
  ui?: ExpertReviewUi,
): number {
  const idx = groups.findIndex((g) => !isGroupReviewAdvanceable(g, responsesByControlId, ui))
  return idx === -1 ? Math.max(groups.length - 1, 0) : idx
}
