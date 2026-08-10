import { useEffect, useState } from 'react'
import {
  type ControlCriticality,
  type ControlGroupCreate,
  type ControlGroupRead,
  type ControlGroupUpdate,
} from '@/types/controls'

interface UseGroupFormParams {
  open: boolean
  group: ControlGroupRead | null
  suggestedId: string
  onCreate: (data: ControlGroupCreate) => Promise<boolean>
  onUpdate: (id: string, data: ControlGroupUpdate) => Promise<boolean>
  onClose: () => void
}

export function useGroupForm({ open, group, suggestedId, onCreate, onUpdate, onClose }: UseGroupFormParams) {
  const isEdit = group !== null
  const code = group?.id ?? suggestedId

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [criticality, setCriticality] = useState<ControlCriticality>('low')
  const [submitting, setSubmitting] = useState(false)

  const nameIsEmpty = name.trim().length === 0

  useEffect(() => {
    if (!open) return
    setName(group?.name ?? '')
    setDescription(group?.description ?? '')
    setCriticality(group?.criticality ?? 'low')
  }, [open, group])

  async function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) return

    setSubmitting(true)

    const ok = isEdit
      ? await onUpdate(group!.id, {
          name: trimmedName,
          description: description.trim() || null,
          criticality,
        })
      : await onCreate({
          id: code,
          name: trimmedName,
          description: description.trim() || null,
          criticality,
        })

    setSubmitting(false)
    if (ok) onClose()
  }

  return {
    isEdit,
    code,
    name,
    setName,
    description,
    setDescription,
    criticality,
    setCriticality,
    nameIsEmpty,
    submitting,
    handleSubmit,
  }
}
