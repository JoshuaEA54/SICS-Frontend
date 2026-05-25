import { type ControlGroup } from '@/types/controls'
import { type Evaluation, type Response, type ReviewProgress } from '@/types/evaluation'

export function requiresExpertVerdict(response: Response): boolean {
  return response.answer === true
}

export function computeReviewProgress(responses: Response[]): ReviewProgress {
  const required = responses.filter(requiresExpertVerdict)
  const completed = required.filter((r) => r.verdict !== null)
  return { completed: completed.length, required: required.length }
}

export function countGroupVerdicts(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): { completed: number; required: number } {
  let completed = 0
  let required = 0
  for (const control of group.controls) {
    const r = responsesByControlId[control.id]
    if (!r || !requiresExpertVerdict(r)) continue
    required += 1
    if (r.verdict !== null) completed += 1
  }
  return { completed, required }
}

export function countPendingVerdictsInGroup(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): number {
  const { completed, required } = countGroupVerdicts(group, responsesByControlId)
  return Math.max(required - completed, 0)
}

function hasAllGroupResponses(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): boolean {
  return group.controls.every((c) => responsesByControlId[c.id] !== undefined)
}

/** Sidebar: solo completo si el experto emitió todos los veredictos requeridos en el grupo. */
export function isGroupVerdictsComplete(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): boolean {
  if (group.controls.length === 0) return false
  const { completed, required } = countGroupVerdicts(group, responsesByControlId)
  return required > 0 && completed === required
}

/** Navegación: se puede avanzar cuando no quedan veredictos pendientes (incl. grupos sin veredictos requeridos). */
export function isGroupReviewAdvanceable(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): boolean {
  if (group.controls.length === 0) return false
  if (!hasAllGroupResponses(group, responsesByControlId)) return false
  return countPendingVerdictsInGroup(group, responsesByControlId) === 0
}

export function hasPendingVerdicts(responses: Response[]): boolean {
  return responses.some((r) => requiresExpertVerdict(r) && r.verdict === null)
}

export function canFinalizeEvaluation(
  evaluation: Evaluation | null,
  responses: Response[],
): boolean {
  if (!evaluation || evaluation.status !== 'submitted') return false
  const { completed, required } = computeReviewProgress(responses)
  return required > 0 && completed === required
}

/** Primer grupo con veredictos pendientes; si todos están listos, el último. */
export function findActiveGroupIndex(
  groups: ControlGroup[],
  responsesByControlId: Record<string, Response | undefined>,
): number {
  const idx = groups.findIndex((g) => !isGroupReviewAdvanceable(g, responsesByControlId))
  return idx === -1 ? Math.max(groups.length - 1, 0) : idx
}
