import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchIcon, PlusCircleIcon } from '@/components/ui/Icons'
import { useGroupsCrud } from '@/features/controlManagement/hooks/useGroupsCrud'
import { useGroupDialogs } from '@/features/controlManagement/hooks/useGroupDialogs'
import { suggestNextGroupId } from '@/features/controlManagement/groupCode'
import { GroupRow } from '@/features/controlManagement/components/GroupRow'
import { GroupFormModal } from '@/features/controlManagement/components/GroupFormModal'

export function GroupsSection() {
  const {
    groups,
    page,
    pages,
    loading,
    error,
    searchInput,
    setSearchInput,
    setPage,
    allIds,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useGroupsCrud()

  const {
    formGroup,
    formOpen,
    deleteTarget,
    deleting,
    openCreate,
    openEdit,
    closeForm,
    openDelete,
    cancelDelete,
    confirmDelete,
  } = useGroupDialogs(deleteGroup)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2">
          <span className="text-text-muted">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Buscar grupo por nombre o código…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <Button variant="primary" size="sm" leftIcon={<PlusCircleIcon />} onClick={openCreate}>
          Nuevo grupo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-text-secondary">{error}</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-[13px] text-text-muted">
            {searchInput
              ? 'No hay grupos que coincidan con la búsqueda.'
              : 'Todavía no hay grupos de controles registrados.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <GroupRow key={group.id} group={group} onEdit={openEdit} onDelete={openDelete} />
            ))}
          </div>

          <Pagination className="mt-6" page={page} pages={pages} onPageChange={setPage} />
        </>
      )}

      <GroupFormModal
        open={formOpen}
        group={formGroup}
        suggestedId={suggestNextGroupId(allIds)}
        onClose={closeForm}
        onCreate={createGroup}
        onUpdate={updateGroup}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar grupo de controles"
        description={`¿Seguro que desea eliminar el grupo "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
