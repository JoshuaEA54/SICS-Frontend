import { useCallback, useMemo, useRef, useState } from 'react'
import { type ControlGroup } from '@/types/controls'
import { type Response } from '@/types/evaluation'
import {
  buildExpertReviewUi,
  countPendingVerdictsInGroup,
  findActiveGroupIndex,
  type ExpertVerdictDraftSource,
} from '@/features/evaluations/expertReview'
import { toastError } from '@/store/toastStore'

export function useExpertReviewNavigation(
  groups: ControlGroup[],
  responsesByControlId: Record<string, Response | undefined>,
  draft: ExpertVerdictDraftSource,
) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const currentGroupIndexRef = useRef(0)

  const groupsRef = useRef(groups)
  groupsRef.current = groups

  const responsesRef = useRef(responsesByControlId)
  responsesRef.current = responsesByControlId

  const draftRef = useRef(draft)
  draftRef.current = draft

  const ui = useMemo(
    () => buildExpertReviewUi(draft),
    [draft.getDisplayVerdict, draft.getObservationsValue],
  )

  const activeGroupIndex = useMemo(
    () => findActiveGroupIndex(groups, responsesByControlId, ui),
    [groups, responsesByControlId, ui],
  )

  const goToGroup = useCallback((index: number) => {
    if (index < 0 || index >= groupsRef.current.length) return
    currentGroupIndexRef.current = index
    setCurrentGroupIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    const group = groupsRef.current[currentGroupIndexRef.current]
    const pending = group
      ? countPendingVerdictsInGroup(
          group,
          responsesRef.current,
          buildExpertReviewUi(draftRef.current),
        )
      : 0
    if (pending > 0) {
      toastError(
        `Faltan ${pending} veredicto${pending === 1 ? '' : 's'} por emitir en este grupo.`,
      )
      return
    }
    goToGroup(currentGroupIndexRef.current + 1)
  }, [goToGroup])

  const goPrev = useCallback(() => {
    goToGroup(currentGroupIndexRef.current - 1)
  }, [goToGroup])

  const guardVerdictInteraction = useCallback((): boolean => {
    if (currentGroupIndexRef.current <= activeGroupIndex) return true
    const activeGroup = groupsRef.current[activeGroupIndex]
    if (!activeGroup) return true
    toastError(`Primero complete el grupo ${activeGroup.id} · ${activeGroup.name}.`)
    return false
  }, [activeGroupIndex])

  const currentGroup = groups[currentGroupIndex] ?? null
  const isLastGroup = currentGroupIndex === groups.length - 1
  const isFirstGroup = currentGroupIndex === 0

  return {
    currentGroupIndex,
    currentGroup,
    activeGroupIndex,
    isLastGroup,
    isFirstGroup,
    goToGroup,
    goNext,
    goPrev,
    guardVerdictInteraction,
  }
}
