import { useState, useEffect, useRef } from 'react'
import { controlsApi } from '@/lib/api/controls'
import { evaluationsApi } from '@/lib/api/evaluations'
import { type ControlGroup } from '@/types/controls'
import { type Evaluation } from '@/types/evaluation'
import { type ResponseState } from './useQuestionnaire'

export function useQuestionnaireLoader(evaluationId: string) {
  const [groups, setGroups] = useState<ControlGroup[]>([])
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responsesMap, setResponsesMap] = useState<Record<string, ResponseState>>({})
  const [initialGroupIndex, setInitialGroupIndex] = useState(0)

  const responsesMapRef = useRef<Record<string, ResponseState>>({})
  responsesMapRef.current = responsesMap

  const groupsRef = useRef<ControlGroup[]>([])
  groupsRef.current = groups

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [groupsData, evalData, responsesData] = await Promise.all([
          controlsApi.getGroupsFull(),
          evaluationsApi.getEvaluation(evaluationId),
          evaluationsApi.getResponses(evaluationId).catch(() => []),
        ])
        if (cancelled) return

        const map: Record<string, ResponseState> = {}
        for (const r of responsesData) {
          map[r.control_id] = {
            response_id: r.id,
            complies: r.answer,
            observations: r.observations ?? '',
            evidence: [],
          }
        }

        const responsesWithId = responsesData.filter((r) => r.id)
        if (responsesWithId.length > 0) {
          const evidenceResults = await Promise.allSettled(
            responsesWithId.map((r) =>
              evaluationsApi.getEvidenceForResponse(r.id).then((ev) => ({ controlId: r.control_id, ev })),
            ),
          )
          for (const result of evidenceResults) {
            if (result.status === 'fulfilled') {
              const { controlId, ev } = result.value
              if (map[controlId]) map[controlId].evidence = ev
            }
          }
        }

        setGroups(groupsData)
        setEvaluation(evalData)
        setResponsesMap(map)

        if (evalData.last_group_id) {
          const idx = groupsData.findIndex((g) => g.id === evalData.last_group_id)
          if (idx >= 0) setInitialGroupIndex(idx)
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar el cuestionario.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [evaluationId])

  return { groups, groupsRef, evaluation, loading, error, responsesMap, setResponsesMap, responsesMapRef, initialGroupIndex }
}
