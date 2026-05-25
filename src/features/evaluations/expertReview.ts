import { type ControlGroup } from '@/types/controls'
import { type Evaluation, type Response, type ResponseVerdict, type ReviewProgress } from '@/types/evaluation'

export function requiresExpertVerdict(response: Response): boolean {
  return response.answer === true
}

export function computeReviewProgress(responses: Response[]): ReviewProgress {
  const required = responses.filter(requiresExpertVerdict)
  const completed = required.filter((r) => r.verdict !== null)
  return { completed: completed.length, required: required.length }
}

export function isGroupVerdictsComplete(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): boolean {
  if (group.controls.length === 0) return false
  return group.controls.every((c) => {
    const r = responsesByControlId[c.id]
    if (!r) return false
    if (!requiresExpertVerdict(r)) return true
    return r.verdict !== null
  })
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

/** Primer grupo con veredictos pendientes; si todos están listos, el último. */
export function findActiveGroupIndex(
  groups: ControlGroup[],
  responsesByControlId: Record<string, Response | undefined>,
): number {
  const idx = groups.findIndex((g) => !isGroupVerdictsComplete(g, responsesByControlId))
  return idx === -1 ? Math.max(groups.length - 1, 0) : idx
}

export function countPendingVerdictsInGroup(
  group: ControlGroup,
  responsesByControlId: Record<string, Response | undefined>,
): number {
  const { completed, required } = countGroupVerdicts(group, responsesByControlId)
  return Math.max(required - completed, 0)
}

export const EXPERT_VERDICT_OPTIONS = [
  { value: 'complies' as const, label: 'Cumple' },
  { value: 'complies_with_observations' as const, label: 'Con observaciones' },
  { value: 'does_not_comply' as const, label: 'No cumple' },
] as const satisfies ReadonlyArray<{ value: ResponseVerdict; label: string }>

export function getVerdictLabel(verdict: ResponseVerdict): string {
  return EXPERT_VERDICT_OPTIONS.find((o) => o.value === verdict)?.label ?? verdict
}
