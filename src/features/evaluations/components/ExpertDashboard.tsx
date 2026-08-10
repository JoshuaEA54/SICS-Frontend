import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs } from '@/components/ui/Tabs'
import { InboxIcon, LayersIcon } from '@/components/ui/Icons'
import { ExpertEvaluationsDashboard } from '@/features/evaluations/components/ExpertEvaluationsDashboard'
import { ManagementPanel } from '@/features/controlManagement/components/ManagementPanel'

type PrimaryTab = 'bandeja' | 'gestion'

const TAB_PATHS: Record<PrimaryTab, string> = {
  bandeja: '/evaluaciones',
  gestion: '/gestion-controles',
}

export function ExpertDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab: PrimaryTab = location.pathname === TAB_PATHS.gestion ? 'gestion' : 'bandeja'

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10">
      <header className="mb-6">
        <h1 className="font-display text-[28px] font-semibold text-text-primary">
          Panel del experto
        </h1>
        <p className="mt-1 text-[13px] text-text-secondary">
          Revise evaluaciones enviadas por las empresas y gestione el catálogo de controles.
        </p>
      </header>

      <Tabs
        variant="underline"
        className="mb-8"
        value={activeTab}
        onChange={(value) => navigate(TAB_PATHS[value as PrimaryTab])}
        items={[
          { value: 'bandeja', label: 'Bandeja de evaluaciones', icon: <InboxIcon /> },
          { value: 'gestion', label: 'Gestión de controles', icon: <LayersIcon /> },
        ]}
      />

      {activeTab === 'bandeja' && <ExpertEvaluationsDashboard />}
      {activeTab === 'gestion' && <ManagementPanel />}
    </div>
  )
}
