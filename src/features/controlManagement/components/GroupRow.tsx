import { PencilIcon, TrashIcon } from '@/components/ui/Icons'
import { CRITICALITY_LABELS, criticalityChipClass } from '@/features/controlManagement/criticality'
import { type ControlGroupRead } from '@/types/controls'

interface GroupRowProps {
  group: ControlGroupRead
  onEdit: (group: ControlGroupRead) => void
  onDelete: (group: ControlGroupRead) => void
}

export function GroupRow({ group, onEdit, onDelete }: GroupRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-border bg-surface px-4 py-3">
      <span className="rounded-md bg-surface-alt px-2 py-1 font-mono text-[11px] font-bold text-primary">
        {group.id}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-text-primary">{group.name}</p>
        {group.description && (
          <p className="truncate text-[12px] text-text-secondary">{group.description}</p>
        )}
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${criticalityChipClass(group.criticality)}`}>
        {CRITICALITY_LABELS[group.criticality]}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(group)}
          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary"
          aria-label={`Editar ${group.name}`}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={() => onDelete(group)}
          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${group.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
