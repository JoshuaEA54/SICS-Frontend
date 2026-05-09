import { InfoIcon } from "@/components/ui/Icons";

type InfoBannerVariant = "blue" | "amber";

const styles: Record<
  InfoBannerVariant,
  { wrapper: string; icon: string; text: string }
> = {
  blue: {
    wrapper: "border-[#bfdbfe] bg-[#eff6ff]",
    icon: "text-[#1d4ed8]",
    text: "text-[#1e3a8a]",
  },
  amber: {
    wrapper: "border-[#fde68a] bg-[#fffbeb]",
    icon: "text-[#d97706]",
    text: "text-[#92400e]",
  },
};

interface InfoBannerProps {
  children: React.ReactNode;
  variant?: InfoBannerVariant;
}

export function InfoBanner({ children, variant = "blue" }: InfoBannerProps) {
  const s = styles[variant];
  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3 ${s.wrapper}`}>
      <span className={`mt-0.5 shrink-0 ${s.icon}`}>
        <InfoIcon />
      </span>
      <p className={`text-[12.8px] font-light leading-[1.6] ${s.text}`}>
        {children}
      </p>
    </div>
  );
}
