import { type ExpertStatusFilter } from '@/features/evaluations/expertFilters'

interface StatusChip {
  value: ExpertStatusFilter
  label: string
  count?: number
}

interface ExpertStatusFilterChipsProps {
  pending: number
  reviewed: number
  activeStatus: ExpertStatusFilter
  loading?: boolean
  showCounts?: boolean
  onSelectStatus: (status: ExpertStatusFilter) => void
  labelId?: string
}

function StatusChipButton({
  chip,
  active,
  loading,
  onClick,
}: {
  chip: StatusChip
  active: boolean
  loading?: boolean
  onClick: () => void
}) {
  const countLabel =
    chip.count !== undefined && chip.value !== 'all'
      ? loading
        ? '…'
        : String(chip.count)
      : null

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-primary bg-[#eff4ff] font-medium text-primary'
          : 'border-border bg-surface-bg text-text-secondary hover:border-primary/30 hover:text-text-primary'
      }`}
    >
      <span>{chip.label}</span>
      {countLabel !== null && (
        <>
          <span aria-hidden className="text-text-muted">
            ·
          </span>
          <span className="tabular-nums">{countLabel}</span>
        </>
      )}
    </button>
  )
}

export function ExpertStatusFilterChips({
  pending,
  reviewed,
  activeStatus,
  loading,
  showCounts = true,
  onSelectStatus,
  labelId = 'expert-status-filter-label',
}: ExpertStatusFilterChipsProps) {
  const chips: StatusChip[] = [
    { value: 'all', label: 'Todas' },
    {
      value: 'submitted',
      label: 'Pendientes',
      count: showCounts ? pending : undefined,
    },
    {
      value: 'reviewed',
      label: 'Revisadas',
      count: showCounts ? reviewed : undefined,
    },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-[12.8px] font-medium text-text-primary">
        Filtrar por
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="inline-flex flex-wrap gap-2"
      >
        {chips.map((chip) => (
          <StatusChipButton
            key={chip.value}
            chip={chip}
            active={activeStatus === chip.value}
            loading={loading}
            onClick={() => onSelectStatus(chip.value)}
          />
        ))}
      </div>
    </div>
  )
}
