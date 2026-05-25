import { useCallback, useMemo } from "react";
import { type ControlGroup } from "@/types/controls";
import { type Evaluation, type Response } from "@/types/evaluation";
import {
  computeReviewProgress,
  countGroupVerdicts,
  isGroupVerdictsComplete,
} from "@/features/evaluations/expertReview";

interface UseExpertReviewDerivedParams {
  evaluation: Evaluation | null;
  responses: Response[];
  responsesByControlId: Record<string, Response | undefined>;
  currentGroup: ControlGroup | null;
}

export function useExpertReviewDerived({
  evaluation,
  responses,
  responsesByControlId,
  currentGroup,
}: UseExpertReviewDerivedParams) {
  const reviewProgress = useMemo(
    () => computeReviewProgress(responses),
    [responses],
  );
  const groupProgress = useMemo(() => {
    if (!currentGroup) return { completed: 0, required: 0 };
    return countGroupVerdicts(currentGroup, responsesByControlId);
  }, [currentGroup, responsesByControlId]);

  const isGroupCompleted = useCallback(
    (group: ControlGroup) =>
      isGroupVerdictsComplete(group, responsesByControlId),
    [responsesByControlId],
  );

  const displayTitle = evaluation?.company_name ?? "Evaluación";

  return { reviewProgress, groupProgress, isGroupCompleted, displayTitle };
}
