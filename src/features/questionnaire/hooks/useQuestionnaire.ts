import { type Evidence } from "@/types/evaluation";
import { useQuestionnaireLoader } from "./useQuestionnaireLoader";
import { useResponseHandlers } from "./useResponseHandlers";
import { useGroupNavigation } from "./useGroupNavigation";

export interface ResponseState {
  response_id: string | null;
  complies: boolean | null;
  observations: string;
  evidence: Evidence[];
}

export function useQuestionnaire(evaluationId: string) {
  const {
    groups,
    groupsRef,
    evaluation,
    loading,
    error,
    responsesMap,
    setResponsesMap,
    responsesMapRef,
    initialGroupIndex,
  } = useQuestionnaireLoader(evaluationId);

  const {
    handleVerdictChange,
    handleObservationsChange,
    handleEvidenceUpload,
    handleDeleteEvidence,
  } = useResponseHandlers(evaluationId, responsesMapRef, setResponsesMap);

  const { currentGroupIndex, activeGroupIndex, goToGroup, goNext, goPrev, handleSubmit } =
    useGroupNavigation(
      evaluationId,
      groupsRef,
      responsesMapRef,
      groups,
      responsesMap,
      initialGroupIndex,
    );

  return {
    groups,
    evaluation,
    loading,
    error,
    currentGroupIndex,
    currentGroup: groups[currentGroupIndex] ?? null,
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
  };
}
