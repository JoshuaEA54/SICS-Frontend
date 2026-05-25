import { useCallback, useEffect, useRef } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { type Response, type ResponseVerdict } from '@/types/evaluation'
import { toastError } from '@/store/toastStore'

interface UseExpertVerdictHandlersParams {
  responses: Response[]
  setResponses: React.Dispatch<React.SetStateAction<Response[]>>
  isReadOnly: boolean
  guardVerdictInteraction: () => boolean
}

export function useExpertVerdictHandlers({
  responses,
  setResponses,
  isReadOnly,
  guardVerdictInteraction,
}: UseExpertVerdictHandlersParams) {
  const responsesRef = useRef(responses)
  useEffect(() => {
    responsesRef.current = responses
  }, [responses])

  const patchResponse = useCallback(
    (responseId: string, patch: Partial<Response>) => {
      setResponses((prev) => {
        const next = prev.map((r) => (r.id === responseId ? { ...r, ...patch } : r))
        responsesRef.current = next
        return next
      })
    },
    [setResponses],
  )

  const handleVerdictChange = useCallback(
    async (responseId: string, verdict: ResponseVerdict) => {
      if (isReadOnly || !guardVerdictInteraction()) return

      const previous =
        responsesRef.current.find((r) => r.id === responseId)?.verdict ?? null
      patchResponse(responseId, { verdict })

      try {
        const updated = await evaluationsApi.updateVerdict(responseId, verdict)
        patchResponse(responseId, updated)
      } catch {
        toastError('No se pudo guardar el veredicto.')
        patchResponse(responseId, { verdict: previous })
      }
    },
    [isReadOnly, guardVerdictInteraction, patchResponse],
  )

  return handleVerdictChange
}
