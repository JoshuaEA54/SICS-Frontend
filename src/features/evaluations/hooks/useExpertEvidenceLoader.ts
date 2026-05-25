import { useCallback, useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { type ControlGroup } from '@/types/controls'
import { type Evidence, type Response } from '@/types/evaluation'

export function useExpertEvidenceLoader(
  currentGroup: ControlGroup | null,
  responsesByControlId: Record<string, Response | undefined>,
) {
  const [evidenceByControlId, setEvidenceByControlId] = useState<Record<string, Evidence[]>>({})
  const [loadingEvidence, setLoadingEvidence] = useState(false)

  useEffect(() => {
    if (!currentGroup) return

    let cancelled = false
    const controlsNeedingEvidence = currentGroup.controls.filter((c) => {
      const r = responsesByControlId[c.id]
      return r?.id && evidenceByControlId[c.id] === undefined
    })

    if (controlsNeedingEvidence.length === 0) return

    async function loadEvidence() {
      setLoadingEvidence(true)
      try {
        const results = await Promise.allSettled(
          controlsNeedingEvidence.map(async (control) => {
            const response = responsesByControlId[control.id]
            if (!response?.id) return { controlId: control.id, evidence: [] as Evidence[] }
            const evidence = await evaluationsApi.getEvidenceForResponse(response.id)
            return { controlId: control.id, evidence }
          }),
        )

        if (cancelled) return

        setEvidenceByControlId((prev) => {
          const next = { ...prev }
          for (const result of results) {
            if (result.status === 'fulfilled') {
              next[result.value.controlId] = result.value.evidence
            }
          }
          return next
        })
      } finally {
        if (!cancelled) setLoadingEvidence(false)
      }
    }

    loadEvidence()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when group changes
  }, [currentGroup?.id])

  const getEvidenceForControl = useCallback(
    (controlId: string) => evidenceByControlId[controlId] ?? [],
    [evidenceByControlId],
  )

  return { evidenceByControlId, loadingEvidence, getEvidenceForControl }
}
