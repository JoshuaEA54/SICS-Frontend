import { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { StepHeader } from '@/components/layout/StepHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/Icons'
import { useQuestionnaire } from '@/features/questionnaire/hooks/useQuestionnaire'
import { GroupSidebar } from '@/features/questionnaire/components/GroupSidebar'
import { GroupHeader } from '@/features/questionnaire/components/GroupHeader'
import { ControlCard } from '@/features/questionnaire/components/ControlCard'
import { toastError } from '@/store/toastStore'

export function QuestionnairePage() {
  const { evaluationId = '' } = useParams<{ evaluationId: string }>()
  const navigate = useNavigate()

  const {
    groups,
    loading,
    error,
    currentGroupIndex,
    currentGroup,
    activeGroupIndex,
    responsesMap,
    handleVerdictChange,
    handleObservationsChange,
    handleEvidenceUpload,
    handleDeleteEvidence,
    goToGroup,
    goNext,
    goPrev,
    handleSubmit,
  } = useQuestionnaire(evaluationId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const guardInteraction = useCallback(() => {
    if (currentGroupIndex <= activeGroupIndex) return true
    const activeGroup = groups[activeGroupIndex]
    toastError(`Primero completa el grupo ${activeGroup.id} · ${activeGroup.name}.`)
    return false
  }, [currentGroupIndex, activeGroupIndex, groups])

  const answeredCount = currentGroup
    ? currentGroup.controls.filter((c) => {
        const r = responsesMap[c.id]
        return r !== undefined && r.complies !== null
      }).length
    : 0

  const isLastGroup = currentGroupIndex === groups.length - 1

  const onSubmitClick = async () => {
    const ok = await handleSubmit()
    if (ok) navigate('/evaluaciones')
  }

  return (
    <PageLayout>
      <Header />
      <StepHeader current="cuestionario" />

      {loading && (
        <div className="flex items-center justify-center py-24">
          <p className="text-text-secondary">Cargando cuestionario…</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-24">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && currentGroup && (
        <div className="flex min-h-[calc(100vh-112.8px)] items-start px-[120px]">
          <GroupSidebar
            groups={groups}
            currentIndex={currentGroupIndex}
            responsesMap={responsesMap}
            onSelectGroup={goToGroup}
          />

          <main className="flex flex-1 flex-col gap-4 py-8 pl-8 pr-0">
            <GroupHeader group={currentGroup} answeredCount={answeredCount} />

            {currentGroup.controls.map((control) => (
              <ControlCard
                key={control.id}
                control={control}
                response={responsesMap[control.id] ?? { response_id: null, complies: null, observations: '', evidence: [] }}
                onVerdictChange={(complies) => { if (guardInteraction()) handleVerdictChange(control.id, complies) }}
                onObservationsChange={(text) => { if (guardInteraction()) handleObservationsChange(control.id, text) }}
                onUploadEvidence={async (files) => { if (guardInteraction()) await handleEvidenceUpload(control.id, files) }}
                onDeleteEvidence={async (evidenceId) => { if (guardInteraction()) await handleDeleteEvidence(control.id, evidenceId) }}
              />
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pb-8 pt-2">
              <button
                onClick={goPrev}
                disabled={currentGroupIndex === 0}
                className="flex items-center gap-2 rounded-[8px] border border-[#eae8e2] px-[17.4px] py-[11px] text-[14px] text-[#c0c0cc] transition-colors disabled:opacity-50 enabled:text-text-secondary enabled:hover:border-border enabled:hover:bg-surface-alt"
              >
                <ArrowLeftIcon />
                Grupo anterior
              </button>

              {isLastGroup ? (
                <button
                  onClick={onSubmitClick}
                  className="flex items-center gap-2 rounded-[8px] bg-teal px-[17.4px] py-[10px] text-[14px] font-medium text-white shadow-[0px_2px_4px_rgba(13,148,136,0.2)] transition-opacity hover:opacity-90"
                >
                  Enviar evaluación
                  <ArrowRightIcon />
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-[8px] bg-primary px-[17.4px] py-[10px] text-[14px] font-medium text-white shadow-[0px_2px_4px_rgba(29,78,216,0.2)] transition-opacity hover:opacity-90"
                >
                  Siguiente grupo
                  <ArrowRightIcon />
                </button>
              )}
            </div>
          </main>
        </div>
      )}
    </PageLayout>
  )
}
