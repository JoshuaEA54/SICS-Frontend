import { useEffect, useRef } from 'react'
import { CheckSmIcon } from '@/components/ui/Icons'
import { type ResponseState } from '@/features/questionnaire/hooks/useQuestionnaire'
import { type ControlGroup } from '@/types/controls'

function isQuestionnaireGroupCompleted(
  group: ControlGroup,
  responsesMap: Record<string, ResponseState>,
): boolean {
  if (group.controls.length === 0) return false
  return group.controls.every((c) => {
    const r = responsesMap[c.id]
    return r !== undefined && r.complies !== null
  })
}

interface GroupSidebarProps {
  groups: ControlGroup[]
  currentIndex: number
  onSelectGroup: (index: number) => void
  responsesMap?: Record<string, ResponseState>
  isGroupCompleted?: (group: ControlGroup) => boolean
  /** Distancia desde el top del viewport cuando el sidebar es sticky (px). Default: Header + StepHeader. */
  stickyTop?: number
}

export function GroupSidebar({
  groups,
  currentIndex,
  onSelectGroup,
  responsesMap = {},
  isGroupCompleted,
  stickyTop = 112.8,
}: GroupSidebarProps) {
  const activeRef = useRef<HTMLLIElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  // Ajusta la altura del sidebar según su posición real en el viewport en cada scroll.
  useEffect(() => {
    const el = asideRef.current
    if (!el) return

    const update = () => {
      const top = el.getBoundingClientRect().top
      el.style.height = `calc(100dvh - ${Math.max(top, 0)}px)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <aside
      ref={asideRef}
      className="sticky w-[248px] shrink-0 overflow-y-auto border-r border-border bg-white"
      style={{ top: stickyTop }}
    >
      <p className="px-[17.6px] pb-2 pt-[19.6px] text-[10.6px] font-medium uppercase tracking-[1.056px] text-text-muted">
        Grupos
      </p>

      <ul>
        {groups.map((group, index) => {
          const isActive = index === currentIndex
          const isCompleted =
            !isActive &&
            (isGroupCompleted
              ? isGroupCompleted(group)
              : isQuestionnaireGroupCompleted(group, responsesMap))

          return (
            <li key={group.id} ref={isActive ? activeRef : null}>
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
