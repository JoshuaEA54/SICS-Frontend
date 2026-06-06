import { useCallback, useMemo } from "react";
import { type ControlGroup } from "@/types/controls";
import { type Evaluation, type Response } from "@/types/evaluation";
import {
  buildExpertReviewUi,
  computeReviewProgress,
  countGroupVerdicts,
  isGroupVerdictsComplete,
  type ExpertVerdictDraftSource,
} from "@/features/evaluations/expertReview";

interface UseExpertReviewDerivedParams {
  evaluation: Evaluation | null;
  responses: Response[];
  responsesByControlId: Record<string, Response | undefined>;
  currentGroup: ControlGroup | null;
  draft: ExpertVerdictDraftSource;
}

export function useExpertReviewDerived({
  evaluation,
  responses,
  responsesByControlId,
  currentGroup,
  draft,
}: UseExpertReviewDerivedParams) {
  const ui = useMemo(
    () => buildExpertReviewUi(draft),
    [draft.getDisplayVerdict, draft.getObservationsValue],
  );

  const reviewProgress = useMemo(
    () => computeReviewProgress(responses, ui),
    [responses, ui],
  );
  const groupProgress = useMemo(() => {
    if (!currentGroup) return { completed: 0, required: 0 };
    return countGroupVerdicts(currentGroup, responsesByControlId, ui);
  }, [currentGroup, responsesByControlId, ui]);

  const isGroupCompleted = useCallback(
    (group: ControlGroup) =>
      isGroupVerdictsComplete(group, responsesByControlId, ui),
    [responsesByControlId, ui],
  );

  const displayTitle = evaluation?.company_name ?? "Evaluación";

  return { reviewProgress, groupProgress, isGroupCompleted, displayTitle };
}
