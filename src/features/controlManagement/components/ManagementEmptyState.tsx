type ManagementEntity = 'grupo' | 'control' | 'estándar'

const pluralLabels: Record<ManagementEntity, string> = {
  grupo: 'grupos',
  control: 'controles',
  estándar: 'estándares',
}

export function ManagementEmptyState({ entity }: { entity: ManagementEntity }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <p className="text-[13px] text-text-muted">
        Todavía no hay {pluralLabels[entity]} para mostrar. Esta sección se conectará al catálogo
        en una próxima fase.
      </p>
    </div>
  )
}
