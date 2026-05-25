import { type Control } from '@/types/controls'

interface ControlCardMetaProps {
  control: Control
}

/** Encabezado compartido de tarjetas de control (empresa y experto). */
export function ControlCardMeta({ control }: ControlCardMetaProps) {
  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 rounded-[5px] border border-[#99f6e4] bg-[#ccfbf1] px-[7.8px] py-[4.5px] font-['Inter',sans-serif] text-[9.7px] font-bold tracking-[0.346px] text-[#0f766e]">
          {control.id}
        </span>
        <h2 className="font-display text-[16.8px] tracking-[-0.168px] text-text-primary">
          {control.name}
        </h2>
      </div>

      <p className="mb-3 text-[13.7px] font-light leading-[1.6] text-[#5a5a70]">
        {control.description}
      </p>

      {control.standards.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {control.standards.map((ref) => (
            <span
              key={`${ref.standard_name}-${ref.clause}`}
              className="rounded-[4px] border border-border bg-[#f5f3ef] px-[6.8px] py-[3px] text-[10.7px] tracking-[0.107px] text-text-secondary"
            >
              {ref.standard_name} · {ref.clause}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
