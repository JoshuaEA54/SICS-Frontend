import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { CRITICALITY_OPTIONS } from '@/features/controlManagement/criticality'
import { useGroupForm } from '@/features/controlManagement/hooks/useGroupForm'
import { CONTROL_GROUP_NAME_MAX_LENGTH, CONTROL_GROUP_DESCRIPTION_MAX_LENGTH } from '@/lib/constants'
import {
  type ControlCriticality,
  type ControlGroupCreate,
  type ControlGroupRead,
  type ControlGroupUpdate,
} from '@/types/controls'

interface GroupFormModalProps {
  open: boolean
  group: ControlGroupRead | null
  suggestedId: string
  onClose: () => void
  onCreate: (data: ControlGroupCreate) => Promise<boolean>
  onUpdate: (id: string, data: ControlGroupUpdate) => Promise<boolean>
}

export function GroupFormModal({
  open,
  group,
  suggestedId,
  onClose,
  onCreate,
  onUpdate,
}: GroupFormModalProps) {
  const {
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
  } = useGroupForm({ open, group, suggestedId, onCreate, onUpdate, onClose })

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar grupo de controles' : 'Nuevo grupo de controles'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            disabled={nameIsEmpty}
            onClick={handleSubmit}
          >
            {isEdit ? 'Guardar cambios' : 'Crear grupo'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <InfoBanner variant="blue">
          {isEdit ? (
            <>
              Código del grupo: <strong className="font-semibold">{code}</strong> (no se puede modificar).
            </>
          ) : (
            <>
              Este grupo se creará con el código <strong className="font-semibold">{code}</strong>, asignado
              automáticamente según el último código usado.
            </>
          )}
        </InfoBanner>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="group-name" className="flex items-baseline gap-1.5">
              <span className="text-[12.8px] font-medium text-text-primary">Nombre</span>
              {nameIsEmpty && (
                <span className="text-[10px] font-semibold text-red-500">REQUERIDO *</span>
              )}
            </label>
            <span
              className={`text-[11px] tabular-nums ${
                name.length >= CONTROL_GROUP_NAME_MAX_LENGTH ? 'text-red-500' : 'text-text-muted'
              }`}
            >
              {name.length} / {CONTROL_GROUP_NAME_MAX_LENGTH}
            </span>
          </div>
          <Input
            id="group-name"
            maxLength={CONTROL_GROUP_NAME_MAX_LENGTH}
            error={nameIsEmpty}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Textarea
          label="Descripción"
          maxLength={CONTROL_GROUP_DESCRIPTION_MAX_LENGTH}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Criticidad"
          options={CRITICALITY_OPTIONS}
          value={criticality}
          onChange={(e) => setCriticality(e.target.value as ControlCriticality)}
        />
      </div>
    </Modal>
  )
}
