import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { SearchIcon, PlusCircleIcon, GridIcon, ChecklistIcon, BookIcon } from '@/components/ui/Icons'
import { ManagementEmptyState } from '@/features/controlManagement/components/ManagementEmptyState'

type ManagementTab = 'grupos' | 'controles' | 'estandares'

const TABS: {
  value: ManagementTab
  label: string
  icon: React.ReactNode
  searchPlaceholder: string
  newLabel: string
}[] = [
  {
    value: 'grupos',
    label: 'Grupos de controles',
    icon: <GridIcon />,
    searchPlaceholder: 'Buscar grupo por nombre o código…',
    newLabel: 'Nuevo grupo',
  },
  {
    value: 'controles',
    label: 'Controles',
    icon: <ChecklistIcon />,
    searchPlaceholder: 'Buscar control por nombre o código…',
    newLabel: 'Nuevo control',
  },
  {
    value: 'estandares',
    label: 'Estándares',
    icon: <BookIcon />,
    searchPlaceholder: 'Buscar estándar…',
    newLabel: 'Nuevo estándar',
  },
]

export function ManagementPanel() {
  const [activeTab, setActiveTab] = useState<ManagementTab>('grupos')
  const current = TABS.find((tab) => tab.value === activeTab) ?? TABS[0]

  return (
    <div>
      <Tabs
        variant="rail"
        items={TABS.map(({ value, label, icon }) => ({ value, label, icon }))}
        value={activeTab}
        onChange={(value) => setActiveTab(value as ManagementTab)}
        className="mb-6"
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2 text-text-muted">
          <SearchIcon />
          <input
            type="text"
            disabled
            placeholder={current.searchPlaceholder}
            className="w-full bg-transparent text-[13px] text-text-muted placeholder:text-text-muted focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
        <Button variant="primary" size="sm" disabled leftIcon={<PlusCircleIcon />} title="Disponible próximamente">
          {current.newLabel}
        </Button>
      </div>

      {activeTab === 'grupos' && <ManagementEmptyState entity="grupo" />}
      {activeTab === 'controles' && <ManagementEmptyState entity="control" />}
      {activeTab === 'estandares' && <ManagementEmptyState entity="estándar" />}
    </div>
  )
}
