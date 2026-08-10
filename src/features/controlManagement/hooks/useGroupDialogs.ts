import { useState } from 'react'
import { type ControlGroupRead } from '@/types/controls'

export function useGroupDialogs(deleteGroup: (id: string) => Promise<boolean>) {
  const [formGroup, setFormGroup] = useState<ControlGroupRead | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ControlGroupRead | null>(null)
  const [deleting, setDeleting] = useState(false)

  function openCreate() {
    setFormGroup(null)
    setFormOpen(true)
  }

  function openEdit(group: ControlGroupRead) {
    setFormGroup(group)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function openDelete(group: ControlGroupRead) {
    setDeleteTarget(group)
  }

  function cancelDelete() {
    setDeleteTarget(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await deleteGroup(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
  }

  return {
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
  }
}
