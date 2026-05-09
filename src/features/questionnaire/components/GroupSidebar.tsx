import { type ControlGroup } from '@/types/controls'
import { type ResponseState } from '../hooks/useQuestionnaire'
import { CheckSmIcon } from '@/components/ui/Icons'

function isGroupCompleted(group: ControlGroup, responsesMap: Record<string, ResponseState>): boolean {
  if (group.controls.length === 0) return false
  return group.controls.every((c) => {
    const r = responsesMap[c.id]
    return r !== undefined && r.complies !== null
  })
}

interface GroupSidebarProps {
  groups: ControlGroup[]
  currentIndex: number
  responsesMap: Record<string, ResponseState>
  onSelectGroup: (index: number) => void
}

export function GroupSidebar({ groups, currentIndex, responsesMap, onSelectGroup }: GroupSidebarProps) {
  return (
    <aside className="sticky top-[112.8px] h-[calc(100vh-112.8px)] w-[248px] shrink-0 overflow-y-auto border-r border-border bg-white">
      <p className="px-[17.6px] pb-2 pt-[19.6px] text-[10.6px] font-medium uppercase tracking-[1.056px] text-text-muted">
        Grupos
      </p>

      <ul>
        {groups.map((group, index) => {
          const isActive = index === currentIndex
          const isCompleted = !isActive && isGroupCompleted(group, responsesMap)

          return (
            <li key={group.id}>
              <button
                onClick={() => onSelectGroup(index)}
                className={`flex w-full items-center gap-[9px] border-l-[2.4px] py-3 pl-[17.6px] pr-[15.2px] text-left transition-colors ${
                  isActive
                    ? 'border-primary bg-[#eff4ff]'
                    : 'border-transparent hover:bg-surface-alt'
                }`}
              >
                <span
                  className={`shrink-0 rounded-[4px] px-[6px] py-[3px] text-[10.4px] font-semibold tracking-[0.416px] ${
                    isActive
                      ? 'bg-[#dbeafe] text-primary'
                      : isCompleted
                        ? 'bg-[#ccfbf1] text-teal'
                        : 'bg-surface-alt text-text-muted'
                  }`}
                >
                  {group.id}
                </span>

                <span
                  className={`flex-1 text-[12.5px] leading-[1.35] ${
                    isActive
                      ? 'font-medium text-text-primary'
                      : isCompleted
                        ? 'text-text-primary'
                        : 'text-[#5a5a70]'
                  }`}
                >
                  {group.name}
                </span>

                {isCompleted && (
                  <span className="shrink-0 text-teal">
                    <CheckSmIcon />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
