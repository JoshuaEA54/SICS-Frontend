import { type ControlGroup } from '@/types/controls'

interface GroupHeaderProps {
  group: ControlGroup
  answeredCount: number
}

export function GroupHeader({ group, answeredCount }: GroupHeaderProps) {
  const total = group.controls.length
  const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0

  return (
    <div className="rounded-[12px] border border-border bg-white px-6 py-5 shadow-[0px_1px_3px_rgba(26,26,46,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-[5px] bg-[#dbeafe] px-[9px] py-[4px] text-[11.2px] font-bold tracking-[0.672px] text-primary">
            {group.id}
          </span>
          <h1 className="font-display text-[21.6px] font-semibold tracking-[-0.432px] text-text-primary">
            {group.name}
          </h1>
        </div>
      </div>

      <p className="mt-1 text-[13.2px] font-light text-text-secondary">{group.description}</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#f0ede7]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-[11.5px] font-medium text-text-secondary">
          {answeredCount} / {total} respondidos
        </span>
      </div>
    </div>
  )
}
