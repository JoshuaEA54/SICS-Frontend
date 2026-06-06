import { useCallback, useEffect, useRef } from 'react'
import { verdictRequiresExpertObservations } from '@/features/evaluations/expertReview'
import { useExpertVerdictDraft } from '@/features/evaluations/hooks/useExpertVerdictDraft'
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
  const draft = useExpertVerdictDraft()

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

  const persistVerdict = useCallback(
    async (
      responseId: string,
      verdict: ResponseVerdict,
      expert_observations: string | null,
    ) => {
      const previous = responsesRef.current.find((r) => r.id === responseId)
      if (!previous) return

      patchResponse(responseId, { verdict, expert_observations })

      try {
        const updated = await evaluationsApi.updateVerdict(responseId, {
          verdict,
          expert_observations,
        })
        draft.clearDraft(responseId)
        patchResponse(responseId, updated)
      } catch (err: unknown) {
        patchResponse(responseId, {
          verdict: previous.verdict,
          expert_observations: previous.expert_observations,
        })
        draft.clearDraft(responseId)
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail
        toastError(
          typeof detail === 'string' ? detail : 'No se pudo guardar el veredicto.',
        )
      }
    },
    [patchResponse, draft],
  )

  const handleVerdictChange = useCallback(
    (responseId: string, verdict: ResponseVerdict) => {
      if (isReadOnly || !guardVerdictInteraction()) return

      if (verdict === 'complies') {
        draft.clearDebounce(responseId)
        draft.clearDraft(responseId)
        void persistVerdict(responseId, 'complies', null)
        return
      }

      if (verdictRequiresExpertObservations(verdict)) {
        draft.setPendingVerdict(responseId, verdict)
        patchResponse(responseId, { verdict })

        const response = responsesRef.current.find((r) => r.id === responseId)
        if (!response) return

        const text = draft.getObservationsValue(response)
        if (text.trim()) {
          draft.scheduleDebouncedSave(responseId, () => {
            void persistVerdict(responseId, verdict, text)
          })
        }
      }
    },
    [isReadOnly, guardVerdictInteraction, draft, persistVerdict, patchResponse],
  )

  const handleExpertObservationsChange = useCallback(
    (responseId: string, text: string) => {
      if (isReadOnly || !guardVerdictInteraction()) return

      const response = responsesRef.current.find((r) => r.id === responseId)
      if (!response) return

      const verdict = draft.getDisplayVerdict(response)
      if (!verdictRequiresExpertObservations(verdict)) return

      draft.setDraftText(responseId, text)
      draft.scheduleDebouncedSave(responseId, () => {
        if (!text.trim()) return
        void persistVerdict(responseId, verdict!, text)
      })
    },
    [isReadOnly, guardVerdictInteraction, draft, persistVerdict],
  )

  const flushExpertObservations = useCallback(
    (responseId: string) => {
      draft.clearDebounce(responseId)
      const response = responsesRef.current.find((r) => r.id === responseId)
      if (!response) return

      const verdict = draft.getDisplayVerdict(response)
      if (!verdictRequiresExpertObservations(verdict)) return

      const text = draft.getObservationsValue(response)
      if (!text.trim()) return

      void persistVerdict(responseId, verdict!, text)
    },
    [draft, persistVerdict],
  )

  return {
    handleVerdictChange,
    handleExpertObservationsChange,
    flushExpertObservations,
    getDisplayVerdict: draft.getDisplayVerdict,
    getObservationsValue: draft.getObservationsValue,
  }
}
