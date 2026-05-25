import { Button } from "@/components/ui/Button";
import { EvaluationBadge } from "@/components/ui/Badge";
import { ReviewProgressLabel } from "@/features/evaluations/components/ReviewProgressLabel";
import { type Evaluation, type ReviewProgress } from "@/types/evaluation";

interface ExpertReviewHeaderProps {
  displayTitle: string;
  evaluation: Evaluation;
  reviewProgress: ReviewProgress;
  onBack: () => void;
}

export function ExpertReviewHeader({
  displayTitle,
  evaluation,
  reviewProgress,
  onBack,
}: ExpertReviewHeaderProps) {
  return (
    <div className="border-b border-border bg-white px-[120px] py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-text-primary">
              {displayTitle}
            </h1>
            <EvaluationBadge status={evaluation.status} />
          </div>
          {evaluation.status === "submitted" && (
            <ReviewProgressLabel progress={reviewProgress} />
          )}
          {evaluation.status === "reviewed" &&
            evaluation.compliance_percentage != null && (
              <p className="text-sm font-medium text-text-primary">
                Cumplimiento: {evaluation.compliance_percentage}%
              </p>
            )}
        </div>
        <Button variant="secondary" onClick={onBack}>
          Volver a la bandeja
        </Button>
      </div>
    </div>
  );
}
