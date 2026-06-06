import { useCallback, useRef, useState } from 'react'
import { RESPONSE_SAVE_DEBOUNCE_MS } from '@/lib/constants'
import { type Response, type ResponseVerdict } from '@/types/evaluation'

export function useExpertVerdictDraft() {
  const [pendingVerdicts, setPendingVerdicts] = useState<Record<string, ResponseVerdict>>({})
  const [draftObservations, setDraftObservations] = useState<Record<string, string>>({})
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const getDisplayVerdict = useCallback(
    (response: Response): ResponseVerdict | null => {
      const selectedBeforeSave = pendingVerdicts[response.id]
      return selectedBeforeSave ?? response.verdict
    },
    [pendingVerdicts],
  )

  const getObservationsValue = useCallback(
    (response: Response): string => {
      const typedBeforeSave = draftObservations[response.id]
      if (typedBeforeSave !== undefined) return typedBeforeSave
      return response.expert_observations ?? ''
    },
    [draftObservations],
  )

  const setPendingVerdict = useCallback((responseId: string, verdict: ResponseVerdict) => {
    setPendingVerdicts((prev) => ({ ...prev, [responseId]: verdict }))
  }, [])

  const setDraftText = useCallback((responseId: string, text: string) => {
    setDraftObservations((prev) => ({ ...prev, [responseId]: text }))
  }, [])

  const clearDraft = useCallback((responseId: string) => {
    setPendingVerdicts((prev) => {
      const next = { ...prev }
      delete next[responseId]
      return next
    })
    setDraftObservations((prev) => {
      const next = { ...prev }
      delete next[responseId]
      return next
    })
  }, [])

  const clearDebounce = useCallback((responseId: string) => {
    clearTimeout(debounceTimers.current[responseId])
    delete debounceTimers.current[responseId]
  }, [])

  const scheduleDebouncedSave = useCallback(
    (responseId: string, onFire: () => void) => {
      clearDebounce(responseId)
      debounceTimers.current[responseId] = setTimeout(onFire, RESPONSE_SAVE_DEBOUNCE_MS)
    },
    [clearDebounce],
  )

  return {
    getDisplayVerdict,
    getObservationsValue,
    setPendingVerdict,
    setDraftText,
    clearDraft,
    clearDebounce,
    scheduleDebouncedSave,
  }
}

export type ExpertVerdictDraft = ReturnType<typeof useExpertVerdictDraft>
