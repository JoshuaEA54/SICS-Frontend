import { type ReactNode } from "react";
import { EXPERT_VERDICT_OPTIONS } from "@/features/evaluations/expertReview";
import { CheckSmIcon, InfoIcon, XIcon } from "@/components/ui/Icons";
import { type ResponseVerdict } from "@/types/evaluation";

interface ExpertVerdictSelectorProps {
  value: ResponseVerdict | null;
  onChange: (verdict: ResponseVerdict) => void;
}

const VERDICT_ICONS: Record<ResponseVerdict, ReactNode> = {
  complies: <CheckSmIcon />,
  complies_with_observations: <InfoIcon />,
  does_not_comply: <XIcon />,
};

const VERDICT_STYLES: Record<
  ResponseVerdict,
  {
    selected: string;
    unselected: string;
    iconSelected: string;
    iconUnselected: string;
  }
> = {
  complies: {
    selected:
      "border-teal bg-teal/10 text-teal shadow-[0_0_0_2px_rgba(13,148,136,0.12)]",
    unselected:
      "border-border bg-surface-bg text-text-secondary hover:border-teal/40 hover:bg-teal/5",
    iconSelected: "border-teal/30 bg-teal/15 text-teal",
    iconUnselected:
      "border-border bg-white text-text-muted group-hover:border-teal/30 group-hover:text-teal",
  },
  complies_with_observations: {
    selected:
      "border-amber bg-amber/10 text-amber-800 shadow-[0_0_0_2px_rgba(245,158,11,0.12)]",
    unselected:
      "border-border bg-surface-bg text-text-secondary hover:border-amber/40 hover:bg-amber/5",
    iconSelected: "border-amber/30 bg-amber/15 text-amber-700",
    iconUnselected:
      "border-border bg-white text-text-muted group-hover:border-amber/30 group-hover:text-amber-700",
  },
  does_not_comply: {
    selected:
      "border-red-400 bg-red-50 text-red-700 shadow-[0_0_0_2px_rgba(248,113,113,0.12)]",
    unselected:
      "border-border bg-surface-bg text-text-secondary hover:border-red-300 hover:bg-red-50/50",
    iconSelected: "border-red-300 bg-red-100 text-red-600",
    iconUnselected:
      "border-border bg-white text-text-muted group-hover:border-red-300 group-hover:text-red-600",
  },
};

export function ExpertVerdictSelector({
  value,
  onChange,
}: ExpertVerdictSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Veredicto del experto"
      className="flex flex-wrap gap-2"
    >
      {EXPERT_VERDICT_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        const styles = VERDICT_STYLES[opt.value];

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`group flex min-w-0 flex-1 basis-[calc(33.333%-0.5rem)] items-center justify-center gap-2 rounded-[8px] border px-3 py-2.5 transition-all ${
              selected ? styles.selected : styles.unselected
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3 ${
                selected ? styles.iconSelected : styles.iconUnselected
              }`}
            >
              {VERDICT_ICONS[opt.value]}
            </span>
            <span className="text-[13px] font-medium leading-tight">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
