import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { SearchIcon, PlusCircleIcon, GridIcon, ChecklistIcon, BookIcon } from '@/components/ui/Icons'
import { ManagementEmptyState } from '@/features/controlManagement/components/ManagementEmptyState'
import { GroupsSection } from '@/features/controlManagement/components/GroupsSection'

type ManagementTab = 'grupos' | 'controles' | 'estandares'

const PLACEHOLDER_TABS: {
  value: 'controles' | 'estandares'
  label: string
  icon: React.ReactNode
  searchPlaceholder: string
  newLabel: string
}[] = [
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

const TABS = [
  { value: 'grupos' as const, label: 'Grupos de controles', icon: <GridIcon /> },
  ...PLACEHOLDER_TABS.map(({ value, label, icon }) => ({ value, label, icon })),
]

export function ManagementPanel() {
  const [activeTab, setActiveTab] = useState<ManagementTab>('grupos')
  const placeholder = PLACEHOLDER_TABS.find((tab) => tab.value === activeTab)

  return (
    <div>
      <Tabs
        variant="rail"
        items={TABS}
        value={activeTab}
        onChange={(value) => setActiveTab(value as ManagementTab)}
        className="mb-6"
      />

      {activeTab === 'grupos' && <GroupsSection />}

      {placeholder && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2 text-text-muted">
              <SearchIcon />
              <input
                type="text"
                disabled
                placeholder={placeholder.searchPlaceholder}
                className="w-full bg-transparent text-[13px] text-text-muted placeholder:text-text-muted focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
            <Button variant="primary" size="sm" disabled leftIcon={<PlusCircleIcon />} title="Disponible próximamente">
              {placeholder.newLabel}
            </Button>
          </div>

          <ManagementEmptyState entity={activeTab === 'controles' ? 'control' : 'estándar'} />
        </div>
      )}
    </div>
  )
}
