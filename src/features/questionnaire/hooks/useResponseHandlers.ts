import { useCallback, useRef } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'
import { toastError } from '@/store/toastStore'
import { type ResponseState } from './useQuestionnaire'

export function useResponseHandlers(
  evaluationId: string,
  responsesMapRef: React.MutableRefObject<Record<string, ResponseState>>,
  setResponsesMap: React.Dispatch<React.SetStateAction<Record<string, ResponseState>>>,
) {
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const handleVerdictChange = useCallback(
    async (controlId: string, complies: boolean) => {
      const prev = responsesMapRef.current[controlId]
      const observations = prev?.observations ?? ''
      setResponsesMap((p) => ({
        ...p,
        [controlId]: {
          response_id: p[controlId]?.response_id ?? null,
          complies,
          observations,
          evidence: p[controlId]?.evidence ?? [],
        },
      }))
      try {
        const saved = await evaluationsApi.saveResponse(evaluationId, controlId, { complies, observations })
        setResponsesMap((p) => ({
          ...p,
          [controlId]: { ...p[controlId], response_id: saved.id },
        }))
      } catch {}
    },
    [evaluationId, responsesMapRef, setResponsesMap],
  )

  const handleObservationsChange = useCallback(
    (controlId: string, text: string) => {
      setResponsesMap((p) => ({
        ...p,
        [controlId]: {
          response_id: p[controlId]?.response_id ?? null,
          complies: p[controlId]?.complies ?? null,
          observations: text,
          evidence: p[controlId]?.evidence ?? [],
        },
      }))
      clearTimeout(debounceTimers.current[controlId])
      debounceTimers.current[controlId] = setTimeout(async () => {
        const state = responsesMapRef.current[controlId]
        if (state?.complies === null || state?.complies === undefined) return
        try {
          const saved = await evaluationsApi.saveResponse(evaluationId, controlId, {
            complies: state.complies,
            observations: text,
          })
          setResponsesMap((p) => ({
            ...p,
            [controlId]: { ...p[controlId], response_id: saved.id },
          }))
        } catch {}
      }, 600)
    },
    [evaluationId, responsesMapRef, setResponsesMap],
  )

  const handleEvidenceUpload = useCallback(
    async (controlId: string, files: File[]) => {
      const responseId = responsesMapRef.current[controlId]?.response_id
      if (!responseId) return
      try {
        const uploaded = await evaluationsApi.uploadEvidence(responseId, files)
        setResponsesMap((p) => ({
          ...p,
          [controlId]: {
            ...p[controlId],
            evidence: [...(p[controlId]?.evidence ?? []), ...uploaded],
          },
        }))
      } catch (err: unknown) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        toastError(detail ?? 'No se pudo subir el archivo.')
      }
    },
    [responsesMapRef, setResponsesMap],
  )

  const handleDeleteEvidence = useCallback(
    async (controlId: string, evidenceId: string) => {
      try {
        await evaluationsApi.deleteEvidence(evidenceId)
        setResponsesMap((p) => ({
          ...p,
          [controlId]: {
            ...p[controlId],
            evidence: (p[controlId]?.evidence ?? []).filter((ev) => ev.id !== evidenceId),
          },
        }))
      } catch {}
    },
    [setResponsesMap],
  )

  return { handleVerdictChange, handleObservationsChange, handleEvidenceUpload, handleDeleteEvidence }
}
