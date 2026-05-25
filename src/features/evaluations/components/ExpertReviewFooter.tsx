import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface ExpertReviewFooterProps {
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isEditable: boolean;
  finalizing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinalize: () => void;
}

export function ExpertReviewFooter({
  isFirstGroup,
  isLastGroup,
  isEditable,
  finalizing,
  onPrev,
  onNext,
  onFinalize,
}: ExpertReviewFooterProps) {
  return (
    <div className="flex items-center justify-between pb-8 pt-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstGroup}
        className="flex items-center gap-2 rounded-[8px] border border-[#eae8e2] px-[17.4px] py-[11px] text-[14px] text-[#c0c0cc] transition-colors disabled:opacity-50 enabled:text-text-secondary enabled:hover:border-border enabled:hover:bg-surface-alt"
      >
        <ArrowLeftIcon />
        Grupo anterior
      </button>

      {isEditable && isLastGroup ? (
        <Button
          variant="primary"
          loading={finalizing}
          onClick={onFinalize}
          rightIcon={<ArrowRightIcon />}
          className="bg-teal shadow-[0px_2px_4px_rgba(13,148,136,0.2)] hover:!bg-teal hover:brightness-110"
        >
          Marcar como revisado
        </Button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isLastGroup}
          className="flex items-center gap-2 rounded-[8px] bg-primary px-[17.4px] py-[10px] text-[14px] font-medium text-white shadow-[0px_2px_4px_rgba(29,78,216,0.2)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Siguiente grupo
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
}
