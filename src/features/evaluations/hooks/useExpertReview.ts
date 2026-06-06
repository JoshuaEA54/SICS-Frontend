import { useParams } from "react-router-dom";
import { useEvidencePreview } from "@/features/evaluations/hooks/useEvidencePreview";
import { useExpertEvidenceLoader } from "@/features/evaluations/hooks/useExpertEvidenceLoader";
import { useExpertFinalize } from "@/features/evaluations/hooks/useExpertFinalize";
import { useExpertReviewDerived } from "@/features/evaluations/hooks/useExpertReviewDerived";
import { useExpertReviewLoader } from "@/features/evaluations/hooks/useExpertReviewLoader";
import { useExpertReviewNavigation } from "@/features/evaluations/hooks/useExpertReviewNavigation";
import { useExpertVerdictHandlers } from "@/features/evaluations/hooks/useExpertVerdictHandlers";

/** Orquestador de la pantalla de revisión del experto. */
export function useExpertReview() {
  const { evaluationId = "" } = useParams<{ evaluationId: string }>();

  const {
    groups,
    evaluation,
    responses,
    setResponses,
    setEvaluation,
    responsesByControlId,
    loading,
    error,
    reload,
  } = useExpertReviewLoader(evaluationId);

  const isReadOnly = evaluation?.status === "reviewed";
  const isEditable = evaluation?.status === "submitted";

  const {
    currentGroup,
    currentGroupIndex,
    activeGroupIndex,
    isLastGroup,
    isFirstGroup,
    goToGroup,
    goNext,
    goPrev,
    guardVerdictInteraction,
  } = useExpertReviewNavigation(groups, responsesByControlId);

  const { getEvidenceForControl, loadingEvidence } = useExpertEvidenceLoader(
    currentGroup,
    responsesByControlId,
  );

  const {
    handleVerdictChange,
    handleExpertObservationsChange,
    flushExpertObservations,
    getDisplayVerdict,
    getObservationsValue,
  } = useExpertVerdictHandlers({
    responses,
    setResponses,
    isReadOnly,
    guardVerdictInteraction,
  });

  const { reviewProgress, groupProgress, isGroupCompleted, displayTitle } =
    useExpertReviewDerived({
      evaluation,
      responses,
      responsesByControlId,
      currentGroup,
    });

  const {
    canFinalize,
    finalizing,
    finalizeConfirmOpen,
    requestFinalize,
    cancelFinalize,
    handleFinalize,
    goToInbox,
  } = useExpertFinalize({
    evaluation,
    setEvaluation,
    isEditable,
    groups,
    activeGroupIndex,
    responses,
  });

  return {
    evaluationId,
    groups,
    evaluation,
    responses,
    responsesByControlId,
    loading,
    error,
    reload,
    isReadOnly,
    isEditable,
    currentGroup,
    currentGroupIndex,
    activeGroupIndex,
    isLastGroup,
    isFirstGroup,
    goToGroup,
    goNext,
    goPrev,
    reviewProgress,
    groupProgress,
    canFinalize,
    isGroupCompleted,
    handleVerdictChange,
    handleExpertObservationsChange,
    flushExpertObservations,
    getDisplayVerdict,
    getObservationsValue,
    requestFinalize,
    handleFinalize,
    finalizeConfirmOpen,
    cancelFinalize,
    finalizing,
    getEvidenceForControl,
    loadingEvidence,
    displayTitle,
    goToInbox,
    ...useEvidencePreview(),
  };
}
